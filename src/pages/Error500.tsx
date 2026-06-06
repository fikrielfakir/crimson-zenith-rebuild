import ErrorPage from "@/components/ErrorPage";

const Error500 = () => {
  return (
    <ErrorPage
      code="500"
      title="Internal Server Error"
      description="The server crashed because of a bug."
      example="null value, undefined variable, or DB issue."
    />
  );
};

export default Error500;
