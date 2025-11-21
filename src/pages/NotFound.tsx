import ErrorPage from "@/components/ErrorPage";

const NotFound = () => {
  return (
    <ErrorPage
      code="404"
      title="Not Found"
      description="The route/page/file does not exist."
      example="/api/users/500 not found."
    />
  );
};

export default NotFound;
