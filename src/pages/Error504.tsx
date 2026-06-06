import ErrorPage from "@/components/ErrorPage";

const Error504 = () => {
  return (
    <ErrorPage
      code="504"
      title="Gateway Timeout"
      description="The server took too long to respond."
      example="slow database or API stuck."
    />
  );
};

export default Error504;
