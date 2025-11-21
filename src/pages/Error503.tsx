import ErrorPage from "@/components/ErrorPage";

const Error503 = () => {
  return (
    <ErrorPage
      code="503"
      title="Service Unavailable"
      description="Server is down or overloaded."
      example="Sometimes happens during maintenance."
    />
  );
};

export default Error503;
