// app/page.js - Versão com Server-Side Rendering
import Portfolio from '@/components/Portfolio';

// Fetch data no servidor
async function getPortfolioData() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
  
  try {
    const res = await fetch(`${API_URL}/portfolio`, {
      // Cache por 1 hora
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch portfolio data');
    }
    
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
}

// Esta é uma Server Component (padrão no App Router)
export default async function Home() {
  const portfolioData = await getPortfolioData();

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erro ao carregar portfólio
          </h1>
          <p className="text-gray-600">
            Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return <Portfolio initialData={portfolioData} />;
}
// Metadata dinâmica para SEO
export async function generateMetadata() {
  const portfolioData = await getPortfolioData();
  const profile = portfolioData?.profile;

  return {
    title: `${profile?.name || 'Portfolio'} - ${profile?.title || 'Desenvolvedor'}`,
    description: profile?.bio || 'Portfolio profissional',
    openGraph: {
      title: profile?.name,
      description: profile?.bio,
      images: profile?.avatar_url ? [profile.avatar_url] : [],
    },
  };
}
