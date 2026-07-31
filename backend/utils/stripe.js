import Stripe from "stripe";

let stripeInstance;

const getStripe = () => {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
    }
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
};

const stripe = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getStripe();
      const value = instance[prop];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  }
);

export default stripe;