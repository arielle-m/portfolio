import { useState, useEffect } from 'react'
import Loading from '../components/Loading'
import { Link } from 'react-router-dom'

export default function PageHome( {restBase, featuredImage, fieldImage} ) {
    const restPath = restBase + 'pages/2?_embed&acf_format=standard'
    const restPathProjects = restBase + 'posts?_embed'
    const restPathSkillDevelopment = restBase + 'skill?_embed&orderby=title&order=asc&per_page=50&skill-category=23'
    const restPathSkillDesign = restBase + 'skill?_embed&orderby=title&order=asc&per_page=50&skill-category=22'
    const [restData, setData] = useState([])
    const [restDataProjects, setDataProjects] = useState([])
    const [restDataSkillDevelopment, setDataSkillDevelopment] = useState([])
    const [restDataSkillDesign, setDataSkillDesign] = useState([])
    const [isLoaded, setLoadStatus] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(restPath)
            const response_projects = await fetch(restPathProjects)
            const response_skill_development = await fetch(restPathSkillDevelopment)
            const response_skill_design = await fetch(restPathSkillDesign)
            if ( response.ok && response_projects.ok && response_skill_development.ok && response_skill_design.ok ) {
                const data = await response.json()
                const dataProjects = await response_projects.json()
                const dataSkillDevelopment = await response_skill_development.json()
                const dataSkillDesign = await response_skill_design.json()
                setData(data)
                setDataProjects(dataProjects)
                setDataSkillDevelopment(dataSkillDevelopment)
                setDataSkillDesign(dataSkillDesign)
                setLoadStatus(true)
            } else {
                setLoadStatus(false)
            }
        }
        fetchData()
    }, [restPath, restPathProjects, restPathSkillDevelopment, restPathSkillDesign])
    
    return (
      <>
        { isLoaded ?
            <article id={`page-${restData.id}`}>
                <section id="#" className="max-h-96 flex flex-col justify-start mb-24">
                    <h1 className="uppercase font-semibold text-4xl tracking-wider mb-2 mt-6">{restData.acf.greeting} <br /><strong className="text-6xl">{restData.acf.name}</strong></h1>
                    <h2 className="font-semibold text-2xl uppercase leading-7 tracking-widest my-2 max-w-md">{restData.acf.occupation}</h2>
                    <div className="mt-2 max-w-md" dangerouslySetInnerHTML={{__html: restData.acf.landing_paragraph}}></div>
                </section>
                <section id="projects">
                    <h2 className="uppercase font-semibold tracking-wider">{restData.acf.projects_header}</h2>
                    <div className="projects md:flex md:flex-wrap md:gap-x-4">
                    {restDataProjects.map( project => 
                        <article key={project.id} id={`post-${project.id}`} className="project-card h-36 max-w-lg md:max-w-md mb-4 mt-0 mx-auto">
                            <Link to={`/project/${project.slug}`} className="relative inline-block
                            bg-orange-200 rounded-2xl p-4 overflow-hidden h-full w-full">
                                {project.featured_media !== 0 && project._embedded &&
                                    <figure 
                                    className="featured-image relative -right-5 -bottom-11 max-h-32 overflow-hidden rounded-2xl" dangerouslySetInnerHTML={featuredImage(project._embedded['wp:featuredmedia'][0])}></figure>
                                }
                                <h3 className="absolute z-30 top-4">{project.title.rendered}</h3>
                            </Link>
                        </article>
                    )}
                    </div>
                </section>
                <section id="about" className="py-8">
                    <h2 className="uppercase font-semibold tracking-wider">{restData.acf.about_header}</h2>
                        <div className="md:flex md:gap-4">
                            {restData.acf.about_image &&
                                <figure className="about-image rounded-2xl max-h-80 w-9/12 overflow-hidden mb-4 mt-0 mx-auto md:w-full md:max-h-none md:h-full" dangerouslySetInnerHTML={fieldImage(restData.acf.about_image)} loading="lazy"></figure>
                            }
                            <div className="md:w-full">
                                <div dangerouslySetInnerHTML={{__html: restData.acf.about_paragraph}}></div>
                                <div dangerouslySetInnerHTML={{__html: restData.acf.about_hobbies}}></div>
                            </div>
                        </div>
                    <article className="skills">
                        <h3>{restData.acf.skills_header}</h3>
                            <h4 className="uppercase font-bold tracking-wider mt-2">{restDataSkillDevelopment[0]._embedded['wp:term'][0][0].name}</h4>
                            <ul>
                            {restDataSkillDevelopment.map (skilldevelopment =>
                                <li key={skilldevelopment.id} id={`post-${skilldevelopment.id}`} className="text-orange-100 bg-orange-700 rounded-full inline-block px-4 py-1 my-1 mx-1">{skilldevelopment.title.rendered}</li>
                            )}
                            </ul>
                            <h4 className="uppercase font-bold tracking-wider mt-2">{restDataSkillDesign[0]._embedded['wp:term'][0][0].name}</h4>
                            <ul>
                            {restDataSkillDesign.map (skilldesign =>
                                <li key={skilldesign.id} id={`post-${skilldesign.id}`} className="text-orange-100 bg-orange-700 rounded-full inline-block px-4 py-1 my-1 mx-1">{skilldesign.title.rendered}</li>
                            )}
                            </ul>
                    </article>
                </section>
                <section id="contact" className="py-8">
                    <h2 className="uppercase font-semibold tracking-wider">{restData.acf.contact_header}</h2>
                    <div dangerouslySetInnerHTML={{__html: restData.acf.contact_paragraph}}></div>
                    <Link to={restData.acf.contact_button.url} target={restData.acf.contact_button.target} className="contact-button no-underline my-0 mx-auto block px-8 py-2 w-max bg-orange-400 rounded-full">{restData.acf.contact_button.title}</Link>
                </section>
            </article>
        : 
            <Loading /> 
        }

      </>
    );
  }