import ErrorPage from "@/components/ErrorPage";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <ErrorPage
      code="404"
      title="Not Found"
      description="The route/page/file does not exist."
      example={`${location.pathname} not found.`}
    />
  );
};

export default NotFound;
