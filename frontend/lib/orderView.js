    import { products } from "@/lib/products";

export const ORDER_STORAGE_KEYS = [
  "orders",
  "mocha_orders",
  "mochaOrders",
  "orderHistory",
  "shop_orders",
];

function parseStoredValue(rawValue) {
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function extractOrderList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.orders)) {
    return value.orders;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

export function readOrders() {
  if (typeof window === "undefined") {
    return [];
  }

  for (const key of ORDER_STORAGE_KEYS) {
    const parsedValue = parseStoredValue(
      window.localStorage.getItem(key)
    );

    const orders = extractOrderList(parsedValue);

    if (orders.length > 0) {
      return orders;
    }
  }

  return [];
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

export function getOrderNumber(order) {
  const value =
    order?.orderNumber ??
    order?.orderNo ??
    order?.number ??
    order?.id ??
    order?._id ??
    "";

  return normalizeText(value).replace(/^#/, "");
}

export function normalizeStatus(value) {
  const status = normalizeText(value).toLowerCase();

  if (
    status.includes("cancel") ||
    status.includes("huỷ") ||
    status.includes("hủy")
  ) {
    return "cancelled";
  }

  if (
    status.includes("return") ||
    status.includes("refund")
  ) {
    return "returned";
  }

  if (
    status.includes("deliver") ||
    status.includes("complete")
  ) {
    return "delivered";
  }

  if (
    status.includes("ship") ||
    status.includes("transit")
  ) {
    return "shipped";
  }

  if (
    status.includes("process") ||
    status.includes("paid") ||
    status.includes("confirm")
  ) {
    return "processing";
  }

  return "processing";
}

export function getStatusLabel(status) {
  const labels = {
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    returned: "Returned",
    cancelled: "Cancelled",
  };

  return labels[normalizeStatus(status)] || "Processing";
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    const result = new Date(value);
    return Number.isNaN(result.getTime()) ? null : result;
  }

  const text = String(value).trim();

  const vietnameseDate =
    text.match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(.+))?$/
    );

  if (vietnameseDate) {
    const [, day, month, year] = vietnameseDate;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );
  }

  const result = new Date(text);

  return Number.isNaN(result.getTime())
    ? null
    : result;
}

export function formatOrderDate(value) {
  const date = parseDateValue(value);

  if (!date) {
    return normalizeText(value) || "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatOrderTime(value) {
  const date = parseDateValue(value);

  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function findProduct(item) {
  const productObject =
    item?.product &&
    typeof item.product === "object"
      ? item.product
      : null;

  if (productObject) {
    return productObject;
  }

  const productId =
    item?.productId ??
    item?.product_id ??
    item?.id ??
    item?._id;

  return products.find(
    (product) => product.id === productId
  );
}

function getItemColor(item) {
  return (
    item?.selectedColor ??
    item?.color ??
    item?.variant?.color ??
    "White"
  );
}

function getItemSize(item) {
  return (
    item?.selectedSize ??
    item?.size ??
    item?.variant?.size ??
    "OS"
  );
}

function normalizeItem(item, index) {
  const product = findProduct(item) || {};
  const color = getItemColor(item);

  const quantity = Number(
    item?.quantity ??
      item?.qty ??
      item?.count ??
      1
  );

  const unitPrice = Number(
    item?.unitPrice ??
      item?.price ??
      product?.price ??
      0
  );

  const image =
    item?.image ??
    item?.productImage ??
    product?.images?.[color] ??
    product?.image ??
    "";

  return {
    id:
      item?.id ??
      item?._id ??
      product?.id ??
      `order-item-${index}`,
    productId:
      item?.productId ??
      item?.product_id ??
      product?.id ??
      "",
    name:
      item?.name ??
      item?.productName ??
      product?.name ??
      "MOCHA Product",
    color,
    size: getItemSize(item),
    quantity:
      Number.isFinite(quantity) && quantity > 0
        ? quantity
        : 1,
    unitPrice:
      Number.isFinite(unitPrice) &&
      unitPrice >= 0
        ? unitPrice
        : 0,
    image,
    sku:
      item?.sku ??
      product?.sku ??
      product?.id ??
      "MOCHA",
  };
}

function getRawItems(order) {
  if (Array.isArray(order?.items)) {
    return order.items;
  }

  if (Array.isArray(order?.products)) {
    return order.products;
  }

  if (Array.isArray(order?.cart)) {
    return order.cart;
  }

  if (Array.isArray(order?.orderItems)) {
    return order.orderItems;
  }

  return [];
}

function normalizeShipping(order) {
  const source =
    order?.shippingAddress ??
    order?.shipping ??
    order?.address ??
    {};

  if (typeof source === "string") {
    return {
      name:
        order?.customerName ??
        order?.name ??
        "MOCHA Customer",
      phone:
        order?.phone ??
        order?.phoneNumber ??
        "",
      address: source,
      city: "",
      country: "",
    };
  }

  const addressParts = [
    source?.address,
    source?.street,
    source?.ward,
    source?.district,
    source?.city,
    source?.province,
    source?.postalCode,
    source?.country,
  ].filter(Boolean);

  return {
    name:
      source?.fullName ??
      source?.name ??
      order?.customerName ??
      order?.name ??
      "MOCHA Customer",
    phone:
      source?.phone ??
      source?.phoneNumber ??
      order?.phone ??
      "",
    address:
      source?.fullAddress ??
      addressParts.join(", ") ??
      "",
    city:
      source?.city ??
      source?.province ??
      "",
    country:
      source?.country ?? "",
  };
}

export function normalizeOrder(order) {
  if (!order) {
    return null;
  }

  const items = getRawItems(order).map(
    normalizeItem
  );

  const calculatedSubtotal = items.reduce(
    (total, item) =>
      total +
      item.unitPrice * item.quantity,
    0
  );

  const subtotal = Number(
    order?.subtotal ??
      order?.subTotal ??
      calculatedSubtotal
  );

  const shipping = Number(
    order?.shippingFee ??
      order?.shippingCost ??
      order?.deliveryFee ??
      0
  );

  const tax = Number(
    order?.tax ??
      order?.taxAmount ??
      0
  );

  const discount = Number(
    order?.discount ??
      order?.discountAmount ??
      0
  );

  const calculatedTotal =
    subtotal + shipping + tax - discount;

  const total = Number(
    order?.total ??
      order?.totalAmount ??
      order?.grandTotal ??
      calculatedTotal
  );

  const rawStatus =
    order?.status ??
    order?.orderStatus ??
    "Processing";

  const createdAt =
    order?.createdAt ??
    order?.date ??
    order?.orderDate ??
    order?.created_at ??
    "";

  return {
    raw: order,
    number: getOrderNumber(order),
    status: normalizeStatus(rawStatus),
    statusLabel: getStatusLabel(rawStatus),
    createdAt,
    dateValue: parseDateValue(createdAt),
    paymentMethod:
      order?.paymentMethod ??
      order?.payment?.method ??
      "Credit / Debit Card",
    paymentStatus:
      order?.paymentStatus ??
      order?.payment?.status ??
      "Payment Confirmed",
    shippingMethod:
      order?.shippingMethod ??
      order?.deliveryMethod ??
      "Standard Shipping",
    trackingNumber:
      order?.trackingNumber ??
      order?.trackingCode ??
      "",
    items,
    subtotal:
      Number.isFinite(subtotal) ? subtotal : 0,
    shipping:
      Number.isFinite(shipping) ? shipping : 0,
    tax:
      Number.isFinite(tax) ? tax : 0,
    discount:
      Number.isFinite(discount)
        ? discount
        : 0,
    total:
      Number.isFinite(total) ? total : 0,
    shippingAddress: normalizeShipping(order),
  };
}

export function getNormalizedOrders() {
  return readOrders()
    .map(normalizeOrder)
    .filter(Boolean)
    .sort((first, second) => {
      const firstTime =
        first.dateValue?.getTime() ?? 0;

      const secondTime =
        second.dateValue?.getTime() ?? 0;

      return secondTime - firstTime;
    });
}

export function findOrderByNumber(
  orderNumber
) {
  const target = normalizeText(
    orderNumber
  ).replace(/^#/, "");

  return (
    getNormalizedOrders().find(
      (order) => order.number === target
    ) || null
  );
}

export function updateStoredOrderStatus(
  orderNumber,
  nextStatus
) {
  if (typeof window === "undefined") {
    return false;
  }

  const target = normalizeText(
    orderNumber
  ).replace(/^#/, "");

  let updated = false;

  for (const key of ORDER_STORAGE_KEYS) {
    const rawValue =
      window.localStorage.getItem(key);

    const parsedValue =
      parseStoredValue(rawValue);

    if (!parsedValue) {
      continue;
    }

    const currentOrders =
      extractOrderList(parsedValue);

    if (currentOrders.length === 0) {
      continue;
    }

    const nextOrders = currentOrders.map(
      (order) => {
        if (
          getOrderNumber(order) !== target
        ) {
          return order;
        }

        updated = true;

        return {
          ...order,
          status: nextStatus,
          orderStatus: nextStatus,
        };
      }
    );

    if (!updated) {
      continue;
    }

    if (Array.isArray(parsedValue)) {
      window.localStorage.setItem(
        key,
        JSON.stringify(nextOrders)
      );
    } else {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          ...parsedValue,
          orders: nextOrders,
        })
      );
    }

    break;
  }

  return updated;
}