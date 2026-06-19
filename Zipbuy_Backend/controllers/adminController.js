import User from "../models/userModel.js";
import Product from "../productSchema.js";
import Order from "../placeOrderSchema.js";

const safeCount = (model, filter) =>
  model.countDocuments(filter).catch(() => 0);

const safeFind = (model, filter, query = {}) =>
  model.find(filter)
    .select(query.select || "")
    .sort(query.sort || { createdAt: -1 })
    .limit(query.limit || 5)
    .lean()
    .catch(() => []);

export const getDashboard = async (req, res) => {
  try {
    const [
      totalBusinesses,
      pendingBusinesses,
      approvedBusinesses,
      rejectedBusinesses,
      totalClients,
      totalProducts,
      totalOrders,
      pendingOrders,
      recentOrders,
      recentBusinesses,
    ] = await Promise.all([
      safeCount(User, { role: "business" }),
      safeCount(User, { role: "business", verificationStatus: "pending" }),
      safeCount(User, { role: "business", verificationStatus: "approved" }),
      safeCount(User, { role: "business", verificationStatus: "rejected" }),
      safeCount(User, { role: "client" }),
      safeCount(Product, {}),
      safeCount(Order, {}),
      safeCount(Order, { orderStatus: "pending" }),
      safeFind(Order, {}, { limit: 5 }),
      safeFind(User, { role: "business" }, {
        select: "email firstName lastName businessProfile.businessName verificationStatus isActive createdAt",
        limit: 5,
      }),
    ]);

    res.json({
      success: true,
      stats: {
        totalBusinesses,
        pendingBusinesses,
        approvedBusinesses,
        rejectedBusinesses,
        totalClients,
        totalProducts,
        totalOrders,
        pendingOrders,
      },
      recentOrders,
      recentBusinesses,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (search) filter.email = { $regex: search, $options: "i" };

    const orders = await Order.find(filter)
      .populate("business", "businessProfile.businessName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("business", "businessProfile.businessName email phone")
      .lean();
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, notes } = req.body;
    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    if (trackingId) order.paymentDetails = { ...order.paymentDetails, trackingId };
    if (notes) order.adminNotes = notes;
    if (status === "delivered" && !order.isPaid) {
      order.isPaid = true;
      order.paymentDetails.paidAt = new Date();
    }
    await order.save();

    res.json({ success: true, message: `Order ${status}`, order });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = { role: "client" };
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(filter);

    const enriched = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ email: c.email });
        const totalSpentArr = await Order.aggregate([
          { $match: { email: c.email } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        return {
          ...c,
          orderCount,
          totalSpent: totalSpentArr[0]?.total || 0,
          lastOrder: (await Order.findOne({ email: c.email }).sort({ createdAt: -1 }).select("createdAt").lean())?.createdAt || null,
        };
      })
    );

    res.json({
      success: true,
      customers: enriched,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleCustomerStatus = async (req, res) => {
  try {
    const customer = await User.findOne({ _id: req.params.id, role: "client" });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    customer.isActive = !customer.isActive;
    await customer.save();
    res.json({ success: true, message: `Customer ${customer.isActive ? "activated" : "deactivated"}`, isActive: customer.isActive });
  } catch (error) {
    console.error("Toggle customer error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const filter = {};
    if (search) filter.productName = { $regex: search, $options: "i" };
    if (category) filter.productCategory = category;

    const products = await Product.find(filter)
      .populate("business", "businessProfile.businessName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.productStatus = product.productStatus === "active" ? "inactive" : "active";
    await product.save();
    res.json({ success: true, message: `Product ${product.productStatus}`, productStatus: product.productStatus });
  } catch (error) {
    console.error("Toggle product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
