import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SEO Services for USA | Expert Ad Management & SEO Audit',
    description: 'Expert SEO services for USA businesses. Boost your Google ranking with comprehensive SEO audits, high-quality backlinks, and targeted ad campaigns.',
    keywords: [
        'SEO and ads expert',
        'backlinks',
        'SEO optimization',
        'google ranking',
        'SEO audit',
        'best ads expert for ecommerce',
        'SEO for e commerce',
    ],
    authors: [{ name: 'Janak Pokharel' }],
    creator: 'Janak Pokharel',
    openGraph: {
        title: 'SEO Services for USA | Expert Ad Management',
        description: 'Unlock growth with expert SEO services and ad management. Specialized in e-commerce SEO, audits, and high-quality backlinks for USA businesses.',
        url: 'https://janakpokharel.com.np/hire-seo-ads-manager/seo-service',
        type: 'article',
        siteName: 'Janak Pokharel Portfolio',
        images: [
            {
                url: 'https://janakpokharel.com.np/image/janakOG.webp',
                width: 1200,
                height: 630,
                alt: 'SEO Services and Ad Management Expert',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'SEO Services for USA | Expert Ad Management',
        description: 'Unlock growth with expert SEO services and ad management. Specialized in e-commerce SEO, audits, and high-quality backlinks for USA businesses.',
        images: ['https://janakpokharel.com.np/image/janakOG.webp'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};
