import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies</h2>
              <p className="text-gray-700">
                Cookies are small pieces of text sent by your web browser by a website you visit. 
                A cookie file is stored in your web browser and allows the Service or a third-party 
                to recognize you and make your next visit easier and the Service more useful to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                When you use and access Morocco Activities Platform, we may place cookies files in your web browser. We use cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To enable certain functions of the Service</li>
                <li>To provide analytics</li>
                <li>To store your preferences</li>
                <li>To enable advertisements delivery, including behavioral advertising</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-700">
                  These cookies are essential for you to browse the website and use its features, 
                  such as accessing secure areas of the site.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700">
                  These cookies collect information that is used to help us understand how our 
                  website is being used and how effective our marketing campaigns are.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Functionality Cookies</h3>
                <p className="text-gray-700">
                  These cookies allow the website to remember choices you make and provide 
                  enhanced, more personal features.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700">
                In addition to our own cookies, we may also use various third-parties cookies 
                to report usage statistics of the Service, deliver advertisements on and through 
                the Service, and so on.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Your Choices Regarding Cookies</h2>
              <p className="text-gray-700 mb-4">
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
              </p>
              <p className="text-gray-700">
                Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Cookie Policy, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                Email: cookies@moroccoactivities.com<br />
                Address: Morocco Activities Platform
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;