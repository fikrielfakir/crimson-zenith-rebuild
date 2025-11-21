import ErrorPage from "@/components/ErrorPage";

const Error429 = () => {
  return (
    <ErrorPage
      code="429"
      title="Too Many Requests"
      description="You hit the rate limit (too many API calls)."
      example="sending more than 100 requests per minute."
    />
  );
};

export default Error429;
