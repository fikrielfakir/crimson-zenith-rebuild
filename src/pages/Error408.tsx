import ErrorPage from "@/components/ErrorPage";

const Error408 = () => {
  return (
    <ErrorPage
      code="408"
      title="Request Timeout"
      description="The server took too long to respond."
      example="slow network connection or server overload."
    />
  );
};

export default Error408;
