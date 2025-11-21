import ErrorPage from "@/components/ErrorPage";

const Error501 = () => {
  return (
    <ErrorPage
      code="501"
      title="Not Implemented"
      description="The server does not support this feature/method."
      example="calling POST on a route that only supports GET."
    />
  );
};

export default Error501;
