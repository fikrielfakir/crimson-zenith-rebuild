import ErrorPage from "@/components/ErrorPage";

const Error401 = () => {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized"
      description="No valid authentication token or login."
      example="missing or expired authentication token."
    />
  );
};

export default Error401;
