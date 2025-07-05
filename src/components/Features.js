// src/components/Features.js
import React from 'react';
import '../styles/components/Features.css';

const Features = () => {
  const featuresData = [
    {
      id: 'quality',
      title: 'We will sell only the meat that we would eat ourselves.',
      content: 'At Zappcart, we\'re big meat-lovers. And by big, we mean huge. So when it comes to the meat we put on your plate, we\'re extremely picky. Every single product is handpicked by a team with years of experience.'
    },
    {
      id: 'freshness',
      title: 'If it\'s not fresh, we won\'t sell it',
      content: 'For meat to stay fresh and retain its natural juices, it needs to be stored at a temperature between 0° and 4°C. We maintain this temperature from the time we procure the product to cleaning, cutting and storing it, until it leaves for delivery. And even when it\'s out for delivery, we keep it chilled right up to your doorstep. Did we mention that we\'re obsessed?'
    },
    {
      id: 'pricing',
      title: 'We will charge only for what you buy',
      content: 'Doesn\'t everyone do this? Not really. Most other places first weigh the meat, then cut up the pieces, and throw out the parts which aren\'t fit to eat, such as offal, gizzard, wingtips, etc. But you still pay based on the original weight even though what you finally get is 10% to 30% less.'
    }
  ];
  
  return (
    <section className="features">
      {featuresData.map(feature => (
        <div key={feature.id} className="feature">
          <div className="feature-title">
            <h3>{feature.title}</h3>
          </div>
          <div className="feature-content">
            <p>{feature.content}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Features;