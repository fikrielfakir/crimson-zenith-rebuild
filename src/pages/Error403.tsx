import ErrorPage from "@/components/ErrorPage";

const Error403 = () => {
  return (
    <ErrorPage
      code="403"
      title="Forbidden"
      description="You're not allowed to access this resource."
      example="trying to access admin page without admin privileges."
    />
  );
};

export default Error403;
