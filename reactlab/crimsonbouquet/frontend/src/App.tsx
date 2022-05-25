import React from 'react';
import { Route, Routes, Navigate, Link, useParams } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import { gql, useQuery } from '@apollo/client'

const GET_ALL_CONTENT = gql`
  query GetAllContent {
    allContent {
      title
      slug
    }
  }
`

const GET_ALL_CONTRIBUTORS = gql`
  query GetAllContributors {
    allContributors {
      id
      firstName
      lastName
    }
  }
`

const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    content(slug: $slug) {
      title
      text
      contributors {
        firstName
        lastName
      }
    }
  }
`

const GET_CONTRIBUTOR = gql`
  query GetContributor($id: Int!) {
    contributor(id: $id) {
      firstName
      middleName
      lastName
      bioText
      Title
    }
  }
`

interface ArticleGQL {
  title: string;
  slug: string;
}

interface ContributorGQL {
  id: number;
  firstName: string;
  lastName: string;
}


const MainPage = function() {
  const { loading:l1, error:e1, data:data1 } = useQuery(GET_ALL_CONTENT);
  const { loading:l2, error:e2, data:data2 } = useQuery(GET_ALL_CONTRIBUTORS); 
  // ^ do we need the status flags for that too :(

  if (l1 || l2) return <p>Loading ...</p>;
  if (e1 || e2) return <p>Error :(</p>;
  
  console.log(data1)
  console.log(data2)

  const Lists = data1.allContent.map((a: ArticleGQL) => (
    <li key={a.slug}><Link to={'article/' + a.slug}>{a.title}</Link></li>
  ));

  const ListWriters = data2.allContributors.map((a: ContributorGQL) => (
    <li key={a.firstName + " " + a.lastName}>
      <Link to={'contributor/' + a.id}>{a.firstName + " " + a.lastName}</Link>
    </li>
  ));


  return (
    <div className="MainPage">
      <h1>Articles</h1>
      <ul>
        { Lists }
      </ul>
      <h1>Contributors</h1>
      <ul>
        { ListWriters }
      </ul>
    </div>
  )
}

const ArticlePage = function() {
  const params = useParams();
  console.log(params);
  const {loading, error, data} = useQuery(GET_ARTICLE, {variables: params});
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data)

  return (
    <div className="article">
      <h1> {data.content.title} </h1>
      <div className="body" dangerouslySetInnerHTML={{__html: data.content.text}} />
    </div>
  )
}

const ContributorPage = function() {
  const params = useParams();
  console.log(params);
  let id:string = params.id!;
  const {loading, error, data} = useQuery(GET_CONTRIBUTOR, {variables: {
    "id": parseInt(id)
  }});
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error :(</p>;

  console.log(data)

  return (
    <div className="contributor">
      <h1> {data.contributor.firstName + " " + data.contributor.middleName + " " + data.contributor.lastName} </h1>
      <h3> {data.contributor.Title}</h3>
      <div className="body" dangerouslySetInnerHTML={{__html: data.contributor.bioText}} />
    </div>
  )
}


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path ='/' element ={<MainPage />} />
        <Route path ='/article/:slug' element={<ArticlePage /> } />
        <Route path ='/contributor/:id' element={<ContributorPage /> } />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
