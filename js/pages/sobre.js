/* =============================================
   SOBRE PAGE — Experiência + Stacks tabs
   ============================================= */

/* ---- Data ---- */
const experiencias = [
  {
    title:   'Desenvolvedor Full Stack',
    company: 'Meta Serviços',
    period:  'Alocada na Nio/Oi',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Lumisportal',  icon: 'img/logo-lumisportal.png'   },
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
      { name: 'MySQL',      icon: 'mysql/mysql-original.svg'           },
    ],
    bullets: [
      'Desenvolvimento de aplicações web corporativas com Java EE e Hibernate.',
      'Criação de APIs REST integradas a sistemas de terceiros (SOAP e REST).',
      'Manutenção e evolução de sistemas legados com modernização de módulos críticos.',
      'Desenvolvimento de interfaces responsivas com HTML5, CSS3 e JavaScript puro.',
    ],
  },
  {
    title:   'Desenvolvedor Full Stack',
    company: 'Sodexo / Pluxee',
    period:  '2021 – Presente',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Spring',     icon: 'spring/spring-original.svg'         },
      { name: 'React',      icon: 'react/react-original.svg'           },
      { name: 'Angular',    icon: 'angular/angular-original.svg'       },
      { name: 'Oracle',     icon: 'oracle/oracle-original.svg'         },
      { name: 'Docker',     icon: 'docker/docker-original.svg'         },
    ],
    bullets: [
      'Desenvolvimento de soluções Full Stack em Java/Spring Boot e React/Angular para plataforma de benefícios corporativos.',
      'Arquitetura e implementação de microsserviços com Spring Cloud, Kafka e Docker.',
      'Otimização de bases Oracle com ganhos de até 40% em performance de queries críticas.',
      'Liderança técnica de squad multidisciplinar com entregas ágeis (Scrum/SAFe).',
      'Integração de fluxos automatizados via n8n e APIs REST com parceiros externos.',
    ],
  },
  {
    title:   'Desenvolvedor Full Stack',
    company: 'Accenture',
    period:  '2017 – 2021',
    stack:   [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'Spring',     icon: 'spring/spring-original.svg'         },
      { name: 'Angular',    icon: 'angular/angular-original.svg'       },
      { name: 'TypeScript', icon: 'typescript/typescript-original.svg' },
      { name: 'Jenkins',    icon: 'jenkins/jenkins-original.svg'       },
    ],
    bullets: [
      'Atuação em projetos estratégicos para clientes dos setores financeiro e de telecomunicações.',
      'Desenvolvimento de sistemas corporativos com Java EE / Spring e Angular (v2+).',
      'Implementação de pipelines CI/CD com Jenkins, GitLab e Azure DevOps.',
      'Condução de code reviews e mentoria técnica de desenvolvedores juniores.',
      'Participação em POCs de modernização de sistemas legados para arquitetura de microsserviços.',
    ],
  },
  {
    title:   'Desenvolvedor Full Stack',
    company: 'SulAmérica',
    period:  '2010 – 2013',
    stack:   [
      { name: 'Java',   icon: 'java/java-original.svg'    },
      { name: 'Oracle', icon: 'oracle/oracle-original.svg' },
      { name: 'Git',    icon: 'git/git-original.svg'      },
    ],
    bullets: [
      'Desenvolvimento e manutenção de sistemas internos de gestão de seguros em Java.',
      'Escrita de procedures e consultas SQL otimizadas em Oracle Database.',
      'Suporte e manutenção evolutiva em ambiente de missão crítica e alta disponibilidade.',
    ],
  },
];

const stackGroups = [
  {
    category: 'Linguagens & Frameworks',
    items: [
      { name: 'Java',       icon: 'java/java-original.svg'             },
      { name: 'JavaScript', icon: 'javascript/javascript-original.svg' },
      { name: 'TypeScript', icon: 'typescript/typescript-original.svg' },
      { name: 'Angular',    icon: 'angular/angular-original.svg'       },
      { name: 'React',      icon: 'react/react-original.svg'           },
      { name: 'Spring MVC', icon: 'spring/spring-original.svg'         },
      { name: 'Hibernate',  icon: 'hibernate/hibernate-original.svg'   },
      { name: 'EJB 3.0',    icon: 'java/java-original.svg'             },
      { name: 'Struts',     icon: 'apache/apache-original.svg'         },
      { name: 'PHP',        icon: 'php/php-original.svg'               },
    ],
  },
  {
    category: 'Banco de Dados & Busca',
    items: [
      { name: 'Oracle',        icon: 'oracle/oracle-original.svg'               },
      { name: 'MySQL',         icon: 'mysql/mysql-original.svg'                 },
      { name: 'Supabase',      icon: 'supabase/supabase-original.svg'           },
      { name: 'Elasticsearch', icon: 'elasticsearch/elasticsearch-original.svg' },
    ],
  },
  {
    category: 'DevOps & Versionamento',
    items: [
      { name: 'Docker',  icon: 'docker/docker-original.svg'          },
      { name: 'Git',     icon: 'git/git-original.svg'                },
      { name: 'SVN',     icon: 'subversion/subversion-original.svg'  },
      { name: 'Jenkins', icon: 'jenkins/jenkins-original.svg'        },
      { name: 'GitLab',  icon: 'gitlab/gitlab-original.svg'          },
    ],
  },
  {
    category: 'Ferramentas & Plataformas',
    items: [
      { name: 'Maven',  icon: 'maven/maven-original.svg'   },
      { name: 'Tomcat', icon: 'tomcat/tomcat-original.svg' },
      { name: 'Jira',   icon: 'jira/jira-original.svg'     },
      { name: 'JBoss',  icon: 'jboss/jboss-original.svg'   },
    ],
  },
  {
    category: 'APIs & Integrações',
    items: [
      { name: 'Swagger', icon: 'swagger/swagger-original.svg'   },
      { name: 'Postman', icon: 'postman/postman-original.svg'   },
    ],
  },
  {
    category: 'Testes & Qualidade',
    items: [
      { name: 'Cypress',          icon: 'cypressio/cypressio-original.svg'              },
      { name: 'Selenium',         icon: 'selenium/selenium-original.svg'                },
      { name: 'Cucumber',         icon: 'cucumber/cucumber-plain.svg'                   },
      { name: 'Robot Framework',  icon: 'robotframework/robotframework-original.svg'    },
      { name: 'SonarQube',        icon: 'sonarqube/sonarqube-original.svg'              },
    ],
  },
  {
    category: 'Sistemas & Portais',
    items: [
      { name: 'Lumis Portal', icon: 'img/logo-lumis.png', local: true },
      { name: 'Siebel',       icon: 'img/logo-siebel.png', local: true },
      { name: 'Vignette',     icon: 'img/logo-vignette.png', local: true },
    ],
  },
  {
    category: 'Automação & IA',
    items: [
      { name: 'n8n', icon: 'img/logo-n8n.svg', local: true },
    ],
  },
];

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/';

const clientLogos = [
  { name: 'Accenture',       logo: 'img/logo-accenture.png',                      period: '2017 – 2021'     },
  { name: 'Sodexo / Pluxee', logo: 'img/logo-pluxee.png',                         period: '2021 – Presente' },
  { name: 'Nio / Oi',        logo: 'img/logo-nio.svg',                            period: 'Alocação'        },
  { name: 'SulAmérica',      logo: 'https://logo.clearbit.com/sulamerica.com.br', period: '2010 – 2013'     },
  { name: 'Lumis',           logo: 'img/logo-lumis.png',                          period: 'Plataforma'      },
];

/* ---- Render ---- */
function renderSobre() {
  const stacksHTML = stackGroups.map(group => `
    <div class="stacks-category reveal">
      <div class="stacks-category__title">${group.category}</div>
      <div class="badge-row">
        ${group.items.map(item => `
          <span class="tech-badge">
            <img src="${item.local ? item.icon : DEVICON + item.icon}" alt="${item.name}" style="width:18px;height:18px;vertical-align:middle;" onerror="this.style.display='none'">
            ${item.name}
          </span>
        `).join('')}
      </div>
    </div>
  `).join('');

  return `
    <section class="sobre page">
      <div class="container">
        <div class="page__header">
          <h2>Sobre mim</h2>
        </div>

        <div class="sobre__bio glass-card reveal">
          <div class="sobre__foto-wrapper">
            <img src="img/ivieximenes.jpg" alt="Foto de perfil" class="sobre__foto">
          </div>
          <p>
            Desenvolvedora Full Stack Sênior com mais de 15 anos de experiência em desenvolvimento de software.
            Forte atuação em projetos de média e alta complexidade com Java, Angular e React —
            de sistemas corporativos a automações com IA. Histórico em empresas como
            Sodexo (Pluxee), Accenture e Lumis, com atuação em clientes como SulAmérica, Oi e Aliansce.
          </p>
          <div class="sobre__stats">
            <div class="sobre__stat">
              <span class="sobre__stat-num">15+</span>
              <span class="sobre__stat-label">Anos de experiência</span>
            </div>
            <div class="sobre__stat">
              <span class="sobre__stat-num">7+</span>
              <span class="sobre__stat-label">Empresas onde atuou</span>
            </div>
            <div class="sobre__stat">
              <span class="sobre__stat-num">10+</span>
              <span class="sobre__stat-label">Clientes corporativos</span>
            </div>
            <div class="sobre__stat">
              <span class="sobre__stat-num">30+</span>
              <span class="sobre__stat-label">Tecnologias no stack</span>
            </div>
          </div>
        </div>

        <div class="stacks-grid">${stacksHTML}</div>
      </div>
    </section>
  `;
}

/* ---- Init ---- */
function initSobre() {}
