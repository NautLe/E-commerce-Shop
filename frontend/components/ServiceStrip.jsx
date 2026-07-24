function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7H14V17H3V7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 11H18L21 14V17H14V11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 20C7.6 20 8.5 19.1 8.5 18C8.5 16.9 7.6 16 6.5 16C5.4 16 4.5 16.9 4.5 18C4.5 19.1 5.4 20 6.5 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17.5 20C18.6 20 19.5 19.1 19.5 18C19.5 16.9 18.6 16 17.5 16C16.4 16 15.5 16.9 15.5 18C15.5 19.1 16.4 20 17.5 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M9 7L5 11L9 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 11H15.5C18.5 11 20.5 13 20.5 16C20.5 19 18.5 21 15.5 21H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const services = [
  {
    icon: <TruckIcon />,
    title: "Free Shipping",
    text: "On all orders over $75",
  },
  {
    icon: <ReturnIcon />,
    title: "Easy Returns",
    text: "30-day return policy",
  },
  {
    icon: <SparkIcon />,
    title: "New Drops",
    text: "Fresh styles, every week",
  },
];

export default function ServiceStrip() {
  return (
    <section className="mochaServiceStrip">
      {services.map((service) => (
        <div className="mochaServiceItem" key={service.title}>
          <div className="mochaServiceIcon">{service.icon}</div>

          <div>
            <strong>{service.title}</strong>
            <p>{service.text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}