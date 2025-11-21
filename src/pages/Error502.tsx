import ErrorPage from "@/components/ErrorPage";

const Error502 = () => {
  return (
    <ErrorPage
      code="502"
      title="Bad Gateway"
      description="The server you're connecting to returned an invalid response."
      example="using a proxy or load balancer."
    />
  );
};

export default Error502;
