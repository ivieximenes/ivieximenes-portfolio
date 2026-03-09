/* =============================================
   DIAGNÓSTICO — Internacionalização (i18n)
   Todos os textos visíveis ao usuário estão
   centralizados aqui para facilitar tradução.
   ============================================= */

const DIAG_I18N = {
  'pt-BR': {

    nav: {
      back: 'Ferramentas',
    },

    steps: {
      form:   'Dados',
      verify: 'E-mail',
      result: 'Relatório',
    },

    /* ── Step 1: Formulário ─────────────────── */
    form: {
      title: 'Diagnóstico de Presença Digital',

      badges: {
        free:     'Gratuito',
        time:     '~2 minutos',
      },

      sections: {
        site:     'Informações do Site',
        business: 'Dados do Negócio',
        contact:  'Contato',
      },

      fields: {
        url:   'URL do site',
        niche: 'Nicho / Segmento',
        city:  'Cidade',
        email: 'Seu e-mail',
      },

      placeholders: {
        url:   'https://seusite.com.br',
        niche: 'Ex: Clínica odontológica',
        city:  'Ex: Rio de Janeiro',
        email: 'voce@empresa.com',
      },

      hints: {
        url:   'Inclua https:// ou http://',
        email: 'Enviaremos um código para confirmar o acesso.',
      },

      submit:  'Analisar gratuitamente',
      sending: '<i class="ph ph-circle-notch ph-spin"></i> Enviando...',
      terms:   'Limite: 1 diagnóstico gratuito.',

      errors: {
        url:   'Informe uma URL válida (https://...).',
        niche: 'Informe o nicho do negócio.',
        city:  'Informe a cidade.',
        email: 'Informe um e-mail válido.',
        send:  'Não foi possível enviar o código.',
        conn:  'Erro de conexão. Tente novamente.',
      },
    },

    /* ── Step 2: Verificação de e-mail ──────── */
    verify: {
      title:       'Verifique seu e-mail',
      descTpl:     'Enviamos um código de <strong>6 dígitos</strong> para <strong>{masked}</strong>. Verifique caixa de entrada e spam.',
      field:       'Código de verificação',
      placeholder: '000000',
      submit:      'Confirmar e iniciar análise',
      verifying:   '<i class="ph ph-circle-notch ph-spin"></i> Verificando...',
      resend:      '<i class="ph ph-arrow-clockwise"></i> Reenviar código',
      resendIn:    '<i class="ph ph-clock"></i> Reenviar em {n}s',
      back:        '<i class="ph ph-arrow-left"></i> Alterar e-mail',

      errors: {
        code:       'O código deve ter 6 dígitos.',
        invalid:    'Código inválido ou expirado.',
        resendFail: 'Não foi possível reenviar.',
        resendErr:  'Erro ao reenviar.',
        conn:       'Erro de conexão. Tente novamente.',
      },
    },

    /* ── Step 3: Loading ────────────────────── */
    loading: {
      title: 'Analisando seu site',
      sub:   'Aguarde que em alguns segundos o relatório será gerado. </br> Consultando múltiplas fontes.',
      steps: [
        'Google PageSpeed Insights',
        'SEO técnico e robots/sitemap',
        'Concorrentes no Google Maps',
        'Análise de mercado com IA',
        'Gerando relatório personalizado',
      ],
    },

    /* ── Resultado: cabeçalho e estrutura ───── */
    result: {
      badge:      'Análise concluída',
      title:      'Diagnóstico de presença digital',
      disclaimer: 'Relatório gerado por automação. Os dados refletem o estado atual do site.',
      headerDesc: 'Este relatório apresenta indicadores que ajudam a avaliar o desempenho e a presença digital do seu site.',
      urlLabel:   'URL Analisada',
      dateLabel:  'Data da Análise',
      newAnalysis:'Nova análise',
      urgency:    'Urgência',

      urgencyMessages: {
        critical: 'O site está perdendo oportunidades diariamente.',
        default:  'Melhorias identificadas que podem maximizar os resultados online.',
      },

      stack: {
        title: 'Stack Tecnológica',
        items: [
          { label: 'Google PageSpeed', icon: 'ph-gauge'            },
          { label: 'Lighthouse v10',   icon: 'ph-magnifying-glass' },
          { label: 'OpenAI Engine',    icon: 'ph-brain'            },
          { label: 'Maps Places API',  icon: 'ph-map-pin'          },
        ],
      },

      tabs: {
        client: 'Visão do Cliente',
        tech:   'Análise Técnica',
      },

      printClient: 'PDF Visão do Cliente',
      printTech:   'PDF Relatório Técnico',
    },

    /* ── Resumo Estratégico ─────────────────── */
    resumo: {
      title: 'Análise Estratégica',
      sub:   'Diagnóstico personalizado gerado por Inteligência Artificial com base nos dados coletados do seu site e do mercado local.',
    },

    /* ── Score Cards ────────────────────────── */
    scores: {
      cards: [
        { label: 'Score Geral',  icon: 'ph-star',         unit: '',  sub: 'de 100 pontos'       },
        { label: 'SEO Local',    icon: 'ph-map-pin',      unit: '%', sub: 'relevância local'      },
        { label: 'Performance',  icon: 'ph-gauge',        unit: '%', sub: 'velocidade & técnica'  },
        { label: 'Conversão',    icon: 'ph-cursor-click', unit: '%', sub: 'potencial de leads'    },
      ],
    },

    /* ── Problemas e Core Web Vitals ────────── */
    problems: {
      title:       'Problemas Críticos',
      countBadge:  '{count} alertas',
      moreCountTpl:'Existem mais <strong>{count} problemas técnicos</strong> identificados.',
      moreSubTpl:  'Sua pontuação de {score}/100 é impactada por falhas ocultas no código.',
      consultCta:  'Solicitar análise',
      chips: {
        criticalTpl: '{count} crítico{plural}',
      },
    },

    vitals: {
      title: 'Vitais da Web',
      labels: {
        lcp: 'LCP – tempo até o maior elemento visível',
        fcp: 'FCP – tempo até o primeiro elemento renderizado',
        tbt: 'TBT – tempo total com scripts bloqueantes',
        cls: 'CLS – deslocamento acumulado de layout',
      },
      good:             '✓ BOM',
      needsImprovement: '⚠ PRECISA MELHORAR',
    },


    /* ── Análise Competitiva ────────────────── */
    competitive: {
      title:          'Análise Competitiva',
      descTpl:        'Como você se posiciona em relação ao mercado local de {niche} em {city}.',
      legendSelf:     'Seu Site',
      legendAvg:      'Concorrente Médio',
      topTitle:       'Top Concorrentes',
      statsTotal:     'Concorrentes',
      statsSemSite:   'Sem site',
      statsRating:    'Rating médio',
      opportunity0: 'Todos os concorrentes analisados na sua região, ainda não possuem site. Uma lacuna clara que pode ser aproveitada por quem investe em presença digital estratégica.',
opportunity1: 'Dos concorrentes analisados na sua região, 1 ainda não possui site. Uma lacuna clara que pode ser aproveitada por quem investe em presença digital estratégica.',
opportunityMany: 'Dos concorrentes analisados na sua região, {count} ainda não possuem site. Uma lacuna clara que pode ser aproveitada por quem investe em presença digital estratégica.',
    },

    /* ── Plano de Implementação ─────────────── */
    plan: {
      title: 'Plano de Implementação',
      desc:  'Sequência estratégica recomendada para maximizar resultados.',
      phases: [
        {
          badge:  'PRIORIDADE CRÍTICA',
          bc:     '#EF4444',
          title:  'Correção Técnica',
          desc:   'Tags HTML, Meta Description, Schema Markup, Sitemap e erros críticos imediatos.',
          active: true,
        },
        {
          badge:  'PRIORIDADE ALTA',
          bc:     '#22C55E',
          title:  'Performance & SEO Local',
          desc:   'Velocidade, Title Tag com cidade e nicho, robots.txt e HTTPS.',
          active: false,
        },
        {
          badge:  'PRIORIDADE MÉDIA',
          bc:     '#F97316',
          title:  'Conteúdo & Conversão',
          desc:   'Prova social, CTAs otimizados e conteúdo localizado para maior relevância.',
          active: false,
        },
      ],
    },

    /* ── Maturidade Digital ─────────────────── */
    maturity: {
      title:    'Posição Digital',
      labelMat: 'Maturidade Digital',
      descMat:  'Nível de otimização técnica e presença digital.',
      labelPot: 'Potencial de Mercado',
      descPot:  'Oportunidade de mercado na região e nicho analisados.',
    },

    fortes: {
      title: 'Pontos Fortes',
    },

    recos: {
      title: 'Oportunidades Estratégicas',
      desc:  'Estratégias baseadas em análise de concorrência, performance e mercado.',
    },

    /* ── Aba Técnica ────────────────────────── */
    tech: {
      metTitle: 'Metodologia de Análise',
      metItems: [
        '<strong>Google Maps Places API:</strong> Mapeamos concorrentes locais, avaliações e presença digital.',
        '<strong>Google PageSpeed Insights API v5:</strong> Métricas de performance, SEO, acessibilidade e boas práticas.',
        '<strong>OpenAI:</strong> Análises estratégicas, recomendações e diagnósticos de conteúdo.',
        '<strong>Scraping HTML:</strong> Dados técnicos, estrutura on-page, segurança e conversão.',
        '<strong>Security Headers:</strong> Verificação de cabeçalhos de segurança HTTP.',
      ],

      psiTitle:      'Google PageSpeed — Dados Completos',
      psiNoData:     'Dados do PageSpeed não disponíveis.',
      cwvTitle:      'Vitais da Web',
      seoTitle:      'Arquivos SEO',
      onPageTitle:   'Estrutura On-Page',
      convTitle:     'Conversão e Contato',
      secTitle:      'Cabeçalhos de Segurança',
      marketTitle:   'Dados de Mercado',
      marketSrc:     'Google Maps Places API',
      marketLimit:   'A API do Google Maps retorna no máximo 20 resultados por consulta.',
      scoringTitle:  'Scoring Detalhado',
      auditTecnica:  'Diagnóstico Técnico',
      auditConteudo: 'Diagnóstico de Conteúdo',
      auditUx:       'Diagnóstico de UX',
      auditMercado:  'Análise de Mercado Detalhada',

      psiCards: [
        { label: 'Performance',    key: 'performance',      icon: 'ph-gauge'            },
        { label: 'SEO',            key: 'seo',              icon: 'ph-magnifying-glass'  },
        { label: 'Acessibilidade', key: 'acessibilidade',   icon: 'ph-eye'              },
        { label: 'Boas Práticas',  key: 'melhores_praticas',icon: 'ph-check-square'     },
      ],

      cwvLabels: {
        fcp:         'FCP – tempo até o primeiro elemento visível',
        lcp:         'LCP – tempo até o maior elemento visível',
        tbt:         'TBT – total de bloqueio por scripts',
        cls:         'CLS – deslocamento acumulado de layout',
        speed_index: 'Speed Index – velocidade percebida',
        tti:         'TTI – tempo até ficar interativo',
      },

      /* [label, note] */
      table: {
        robots:        ['robots.txt',                 'Permite ou bloqueia indexação'],
        sitemap:       ['sitemap.xml',                'Facilita descoberta de páginas'],
        https:         ['HTTPS ativo',                'Segurança e ranking no Google'],
        canonical:     ['Canonical URL',              ''],
        metaRobots:    ['Meta robots',                ''],
        lang:          ['Idioma',                     ''],
        schema:        ['Schema.org',                 ''],
        title:         ['Title',                      ''],
        metaDesc:      ['Meta description',           ''],
        h1:            ['Tags H1',                    'Ideal: apenas 1'],
        h2:            ['Tags H2',                    ''],
        hierarchy:     ['Hierarquia de headings',     ''],
        totalImages:   ['Total de imagens',           ''],
        imagesNoAlt:   ['Imagens sem alt',            ''],
        lazyLoad:      ['Lazy load',                  ''],
        internalLinks: ['Links internos',             ''],
        externalLinks: ['Links externos',             ''],
        brokenLinks:   ['Links quebrados',            ''],
        cssMinified:   ['CSS minificado',             ''],
        jsMinified:    ['JS minificado',              ''],
        gzip:          ['Compressão Gzip/Brotli',     ''],
        cms:           ['CMS detectado',              ''],
        framework:     ['Framework',                  ''],
        phone:         ['Telefone visível',           ''],
        whatsapp:      ['WhatsApp',                   ''],
        emailContact:  ['E-mail de contato',          ''],
        address:       ['Endereço',                   ''],
        cta:           ['Botão CTA',                  'Ex: "Fale conosco", "Solicite orçamento"'],
        contactForm:   ['Formulário de contato',      ''],
        localBusiness: ['Schema LocalBusiness',       'Dados estruturados para SEO local'],
        openGraph:     ['Open Graph (redes sociais)', ''],
        size:          ['Tamanho da página',          ''],
        requests:      ['Requisições HTTP',           ''],
        server:        ['Servidor',                   ''],
        protocol:      ['Protocolo',                  ''],
        mktTotal:      ['Concorrentes mapeados',      ''],
        mktWithSite:   ['Com website',                ''],
        mktNoSite:     ['Sem website',                ''],
        mktPctNoSite:  ['% sem website',              ''],
        mktAvgRating:  ['Avaliações médias',          ''],
        mktRadius:     ['Raio de busca',              ''],
      },

      security: {
        headers: [
          { k: 'has_hsts',                l: 'HSTS',                    d: 'Força HTTPS'             },
          { k: 'has_x_frame_options',     l: 'X-Frame-Options',         d: 'Anti-clickjacking'       },
          { k: 'has_csp',                 l: 'Content-Security-Policy', d: 'Anti-XSS'                },
          { k: 'has_x_content_type',      l: 'X-Content-Type-Options',  d: 'Anti-MIME sniffing'      },
          { k: 'has_referrer_policy',     l: 'Referrer-Policy',         d: 'Controle de referência'  },
          { k: 'has_permissions_policy',  l: 'Permissions-Policy',      d: 'Controle de APIs'        },
        ],
      },

      sources: {
        directSite:  'Análise direta do site',
        pagespeed:   'Google PageSpeed Insights API',
        mapsApi:     'Google Maps Places API',
        httpHeaders: 'HTTP Headers Analysis',
      },

      onPage: {
        idealH1:    'Ideal: apenas 1',
        a11yIssue:  '<span class="c-fail">Problema de acessibilidade</span>',
        a11yOk:     '<span class="c-ok">OK</span>',
        imgUnit:    ' imagens',
        broken:     '<span class="c-fail">Problema</span>',
        brokenOk:   '<span class="c-ok">OK</span>',
        chars:      ' chars',
        km:         ' km',
        pct:        '%',
      },
    },

    /* ── CTA final ──────────────────────────── */
    cta: {
      title:       'Seu site está perdendo clientes todos os dias.',
      subTpl:      'Este relatório foi gerado por um sistema de análise com múltiplas IAs e deve ser utilizado como ponto de partida para a identificação de oportunidades de melhoria.',
      subHighTpl:  'A ferramenta identifica padrões e possíveis problemas, porém a interpretação estratégica ainda depende de uma avaliação profissional complementar, capaz de validar e aprofundar as recomendações apresentadas. </br></br> Entre em contato para entender quais pontos realmente merecem atenção e quais ações podem gerar maior impacto nos resultados do seu site.',

      profile: {
        name:     'Ivie Ximenes',
        role:     'Especialista em portais',
        photo:    '/img/ivieximenes.jpg',
        photoAlt: 'Ivie Ximenes — Especialista em portais',
        social: {
          wa: {
            href:  'https://wa.me/5522981748083?text=Ol%C3%A1%20Ivie!%20Fiz%20o%20diagn%C3%B3stico%20do%20meu%20site%20e%20gostaria%20de%20conversar%20sobre%20as%20melhorias.',
            label: 'WhatsApp',
          },
          li: { href: 'https://www.linkedin.com/in/ivieximenes/', label: 'LinkedIn'   },
          ig: { href: 'https://instagram.com/ivieximenes',        label: 'Instagram'  },
        },
      },

      primaryBtn:    'SOLICITAR CONSULTORIA',
      primaryHref:   'https://wa.me/5522981748083?text=Ol%C3%A1%20Ivie!%20Gostaria%20de%20solicitar%20uma%20consultoria.',
      secondaryBtn:  'Meus projetos',
      secondaryHref: '/projetos',
      fine:          'Respondo em até 24h úteis.',
    },

  }, /* end pt-BR */
}; /* end DIAG_I18N */

/* ── Locale ativa ─────────────────────────── */
/** Troque para 'en' quando o conteúdo em inglês estiver pronto. */
const DIAG_LOCALE = 'pt-BR';

/**
 * Retorna string traduzida. Suporta interpolação de placeholders {key}.
 * Exemplos:
 *   _t('form.errors.url')
 *   _t('problems.moreCountTpl', { count: 3 })
 *   _t('verify.resendIn', { n: 45 })
 */
function _t(key, vars) {
  const keys = key.split('.');
  let val = DIAG_I18N[DIAG_LOCALE];
  for (const k of keys) {
    val = val?.[k];
    if (val === undefined) return key; /* fallback: retorna o próprio path */
  }
  if (vars && typeof val === 'string') {
    return val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
  }
  return val ?? key;
}
