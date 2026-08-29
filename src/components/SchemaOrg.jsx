export default function SchemaOrg() {
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Indiawalls Infratech Private Limited',
        image: 'https://indiawalls.in/logo.png',
        '@id': 'https://indiawalls.in',
        url: 'https://indiawalls.in',
        telephone: '+917820879777',
        priceRange: '₹₹',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Khasra No. 251, 252, Tehsil Tapukara, Daganheri',
            addressLocality: 'Alwar',
            addressRegion: 'Rajasthan',
            postalCode: '301707',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 28.077,
            longitude: 76.824,
        },
        areaServed: [
            'Alwar',
            'Bhiwadi',
            'Gurugram',
            'Faridabad',
            'Panipat',
            'Palwal',
            'Delhi NCR',
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
    );
}