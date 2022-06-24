import React from 'react';
import axios from 'axios';
import './App.css';

const baseURL = "http://localhost:9000/apiRouter/faqs-users";

function App() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPost(response.data);
    }
    );
  }, []);

  if (!post) return null;
  console.log(post);
  return (
    
    <div>
      <ul>
      {post.map((faqitem, id) => (
        <li key={id}>
           <p>Nom: {faqitem.nom}</p>
        </li>
      ))}
      </ul>
          </div>
  );
}

export default App;
