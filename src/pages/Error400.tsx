import ErrorPage from "@/components/ErrorPage";

const Error400 = () => {
  return (
    <ErrorPage
      code="400"
      title="Bad Request"
      description="The request is invalid."
      example="missing parameters or invalid JSON."
    />
  );
};

export default Error400;
