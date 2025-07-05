// src/components/Testimonials.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/components/Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Mock data - in a real app you'd fetch from Firebase
        const mockTestimonials = [
          {
            id: 'test1',
            name: 'Anjali',
            location: 'Bangalore',
            quote: "Zappcart chicken is my favourite - it's fresh and clean.",
            image: 'https://thumbs.dreamstime.com/b/simple-indian-girl-sweet-smile-happy-face-44021920.jpg'
          },
          {
            id: 'test2',
            name: 'Saurabh',
            location: 'Kolkata',
            quote: "Zappcart makes cooking easy with pre-cut & cleaned meats!",
            image: 'https://media.istockphoto.com/id/1361217779/photo/portrait-of-happy-teenage-boy-at-park.jpg?s=612x612&w=0&k=20&c=yGHZLPu6UWwoj2wazbbepxmjl29MS1Hr2jV3N0FzjyI='
          },
          {
            id: 'test3',
            name: 'Riya',
            location: 'Delhi',
            quote: "Absolutely love Zappcart Prawns! They are soft & cleaned.",
            image: 'https://media.istockphoto.com/id/939108006/photo/portrait-of-cute-girl.jpg?s=612x612&w=0&k=20&c=Zjv4R6a73O3S8JMF9rKsAdn8r4ON-nt90UDJHdSPV6M='
          },
          {
            id: 'test4',
            name: ' Rahul',
            location: 'Mysore',
            quote: "I've never had seafood that's better than Zappcart!",
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRksFX3uD_Bc8ondYmK5OfBjgZIjRZvXtq24H1fBOM6RVaKzrMnF4CB9I0iUsBnTcloQqc&usqp=CAU'
          },
          {
            id: 'test5',
            name: ' Siddharth',
            location: 'Bangalore',
            quote: "I liked Zappcart' Chicken Breast Boneless is!",
            image: 'https://img.freepik.com/free-photo/young-indian-man-dressed-trendy-outfit-monitoring-information-from-social-networks_231208-2766.jpg'
          }
        ];
        
        setTestimonials(mockTestimonials);
        
        // In a real app, you'd use code like this:
        /*
        const querySnapshot = await getDocs(collection(db, 'testimonials'));
        const testimonialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setTestimonials(testimonialsData);
        */
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading testimonials...</div>;
  }
  
  return (
    <section className="testimonials">
      <div className="testimonial-container">
        <div className="testimonial-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-quote">
                {testimonial.quote}
              </div>
              
              <div className="testimonial-person">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="testimonial-name">{testimonial.name}</div>
                <div className="testimonial-location">{testimonial.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;