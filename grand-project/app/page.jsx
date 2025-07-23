import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = await createSupabaseServerClient(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/app/dashboard');
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Recipe Generation
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Create delicious, personalized recipes in seconds with Chef Paxto's advanced AI technology.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Get Started Free
              </Link>
              <Link
                href="/features"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-lg text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Amazing Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Personalized Recipes</h3>
              <p className="text-gray-600">
                Get recipes tailored to your dietary preferences and ingredients you have on hand.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Nutrition Tracking</h3>
              <p className="text-gray-600">
                Detailed nutritional information for every recipe to help you meet your health goals.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Smart Shopping</h3>
              <p className="text-gray-600">
                Generate shopping lists based on your meal plans and pantry inventory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your cooking?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of happy users creating amazing meals every day.
          </p>
          <Link
            href="/signup"
            className="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg inline-block"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}