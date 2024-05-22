const NotFoundPage = () => {
  return (
    <>
      <h1>Please enter the correct path:</h1>
      <ol>
        <li className="text-blue-200">/</li>
        <li className="text-blue-300">/student</li>
        <li className="text-blue-400">/staff</li>
        <li className="text-blue-500">/company</li>
        <li className="text-blue-600">/login/student</li>
        <li className="text-blue-700">/login/company</li>
      </ol>
    </>
  );
};

export default NotFoundPage;
