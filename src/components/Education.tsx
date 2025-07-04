import React, { useState } from 'react';
import { BookOpen, Clock, TrendingUp, Target, Brain, Heart } from 'lucide-react';

const Education: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const articles = [
    {
      id: 1,
      title: 'Expectativas Realistas na Musculação',
      category: 'Iniciante',
      readTime: '5 min',
      icon: Target,
      content: `
        <h3>Ganho Muscular Real para Iniciantes</h3>
        <p>É comum iniciantes terem expectativas irreais sobre ganho muscular. A ciência mostra que:</p>
        <ul>
          <li><strong>1º ano:</strong> 9-11kg de músculo</li>
          <li><strong>2º ano:</strong> 4-5kg de músculo</li>
          <li><strong>3º ano:</strong> 2-3kg de músculo</li>
          <li><strong>4º ano em diante:</strong> 1-2kg de músculo</li>
        </ul>
        <p>Esses valores são para homens com treinamento e nutrição otimizados. Mulheres ganham aproximadamente metade desses valores.</p>
        
        <h3>Por que Ganhos Rápidos São Ilusão?</h3>
        <p>Ganhos de peso superiores a 500g por semana geralmente indicam:</p>
        <ul>
          <li>Acúmulo de gordura corporal</li>
          <li>Retenção de líquidos</li>
          <li>Conteúdo intestinal</li>
          <li>Erro na medição</li>
        </ul>
        
        <h3>Foque no Processo</h3>
        <p>A musculação é uma jornada de longo prazo. Celebre pequenas vitórias e mantenha a consistência!</p>
      `
    },
    {
      id: 2,
      title: 'Síntese Proteica e Recuperação',
      category: 'Ciência',
      readTime: '7 min',
      icon: Brain,
      content: `
        <h3>Como Funciona o Crescimento Muscular</h3>
        <p>O crescimento muscular ocorre através de um processo complexo:</p>
        <ul>
          <li><strong>Estímulo:</strong> Treinamento cria microlesões</li>
          <li><strong>Sinalização:</strong> Corpo detecta necessidade de reparo</li>
          <li><strong>Síntese:</strong> Produção de novas proteínas</li>
          <li><strong>Adaptação:</strong> Músculo fica mais forte e maior</li>
        </ul>
        
        <h3>Janela Anabólica</h3>
        <p>Contrário ao mito, a "janela anabólica" dura 24-48 horas após o treino, não apenas 30 minutos.</p>
        
        <h3>Importância do Sono</h3>
        <p>Durante o sono profundo, o corpo libera hormônio do crescimento (GH), essencial para:</p>
        <ul>
          <li>Reparação muscular</li>
          <li>Síntese proteica</li>
          <li>Recuperação do sistema nervoso</li>
        </ul>
        
        <p><strong>Dica:</strong> Dormir menos de 7 horas reduz a síntese proteica em até 20%!</p>
      `
    },
    {
      id: 3,
      title: 'Progressão Inteligente',
      category: 'Treinamento',
      readTime: '4 min',
      icon: TrendingUp,
      content: `
        <h3>Sobrecarga Progressiva</h3>
        <p>O princípio mais importante da musculação é a sobrecarga progressiva:</p>
        <ul>
          <li><strong>Aumentar peso:</strong> 2.5-5kg quando conseguir fazer todas as repetições</li>
          <li><strong>Aumentar repetições:</strong> Adicione 1-2 reps por série</li>
          <li><strong>Aumentar séries:</strong> Adicione mais volume gradualmente</li>
          <li><strong>Diminuir descanso:</strong> Aumente densidade do treino</li>
        </ul>
        
        <h3>Quando Progredir?</h3>
        <p>Regra simples: se conseguir fazer todas as séries e repetições com boa forma, está na hora de progredir.</p>
        
        <h3>Planaltos são Normais</h3>
        <p>Todos passam por planaltos. Estratégias para superá-los:</p>
        <ul>
          <li>Variar exercícios a cada 4-6 semanas</li>
          <li>Semana de deload (reduzir volume)</li>
          <li>Melhorar recuperação (sono e nutrição)</li>
          <li>Avaliar técnica de execução</li>
        </ul>
      `
    },
    {
      id: 4,
      title: 'Nutrição para Hipertrofia',
      category: 'Nutrição',
      readTime: '6 min',
      icon: Heart,
      content: `
        <h3>Fundamentos da Nutrição</h3>
        <p>Para ganhar músculo, você precisa:</p>
        <ul>
          <li><strong>Superávit calórico:</strong> 200-500 calorias acima do gasto</li>
          <li><strong>Proteína adequada:</strong> 1.6-2.2g por kg corporal</li>
          <li><strong>Carboidratos:</strong> 4-7g por kg corporal</li>
          <li><strong>Gorduras:</strong> 0.8-1.2g por kg corporal</li>
        </ul>
        
        <h3>Timing Nutricional</h3>
        <p>Embora não seja crítico, algumas estratégias podem otimizar resultados:</p>
        <ul>
          <li>Proteína em cada refeição (20-40g)</li>
          <li>Carboidratos pré-treino para energia</li>
          <li>Proteína pós-treino para recuperação</li>
          <li>Caseína antes de dormir (opcional)</li>
        </ul>
        
        <h3>Hidratação</h3>
        <p>Água é essencial para:</p>
        <ul>
          <li>Transporte de nutrientes</li>
          <li>Regulação da temperatura</li>
          <li>Lubrificação das articulações</li>
          <li>Síntese proteica</li>
        </ul>
        
        <p><strong>Meta:</strong> 35-40ml por kg corporal por dia</p>
      `
    }
  ];

  const ArticleCard = ({ article }: { article: typeof articles[0] }) => {
    const Icon = article.icon;
    return (
      <div
        onClick={() => setSelectedArticle(article.id)}
        className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {article.category}
              </span>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{article.readTime}</span>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600">
              Clique para ler o artigo completo
            </p>
          </div>
        </div>
      </div>
    );
  };

  const selectedArticleData = articles.find(a => a.id === selectedArticle);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">Educação Científica</h1>
        <p className="text-purple-100">Aprenda com base em evidências</p>
      </div>

      {!selectedArticle ? (
        <div className="p-6 space-y-6">
          {/* Featured Article */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-sm font-medium">Artigo em Destaque</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Mitos vs. Realidade na Musculação</h2>
            <p className="text-blue-100 mb-4">
              Descubra os principais mitos que impedem seu progresso
            </p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ler Agora
            </button>
          </div>

          {/* Articles Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Artigos Científicos</h2>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Quick Tips */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dicas Rápidas</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Consistência {'>'} Perfeição:</strong> É melhor treinar 3x por semana por 1 ano do que 6x por 2 meses.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Sono é Ganho:</strong> 7-9 horas de sono são tão importantes quanto o treino.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Paciência Paga:</strong> Resultados visíveis aparecem após 8-12 semanas de treino consistente.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Voltar aos artigos
          </button>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {selectedArticleData?.category}
              </span>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{selectedArticleData?.readTime}</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {selectedArticleData?.title}
            </h1>
            
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: selectedArticleData?.content || '' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;