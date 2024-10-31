import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 24px;
    max-width: 1024px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
`;

const HeroBanner = styled.div`
    background-color: #f97316; /* Solid orange color */
    color: white;
    padding: 40px 20px;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 24px;
`;

const HeroTitle = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    margin: 0;
`;

const Section = styled.section`
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
`;

const SubHeading = styled.h2`
    font-size: 1.5rem;
    font-weight: semibold;
    margin-bottom: 16px;
`;

const List = styled.ul`
    padding-left: 0;
    margin: 0;
    list-style: none;
    position: relative;
`;

const ListItem = styled.li`
    margin-bottom: 16px;
    padding-left: 1.5rem;
    position: relative;
    font-size: 1rem;
    
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 12px;
        height: 12px;
        background: transparent;
        border-radius: 50%;
        transform: translateY(-50%);
    }

    &::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 50%;
        height: 100%;
        width: 2px;
        background: red;
        transform: translateY(-50%);
        z-index: -1;
    }

    &:not(:last-of-type)::after {
        height: calc(100% + 16px); /* Extend line to connect to the next item */
    }
`;

const Link = styled.a`
    color: #3b82f6;
    text-decoration: underline;
    font-weight: bold;

    &:hover {
        text-decoration: none;
    }
`;

const JudgeContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 16px;
`;

const JudgeCard = styled.div`
    text-align: center;
    width: 150px;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 16px;
`;

const JudgeImage = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 8px;
    object-fit: cover;
`;

const JudgeName = styled.p`
    font-weight: bold;
    margin: 10px 0 5px;
`;

const JudgeTitle = styled.p`
    margin: 0;
`;

const Hackathon = () => {
    const judges = [
        { name: 'Akanksha Jhunjhunwala', title: 'Embedded & Electronics Engineer', avatar: '/aks.png' },
        { name: 'Ben R.', title: 'Product Engineer', avatar: '/blank.jpg' }
    ];

    const winners = [
        { name: 'Mukesh A.', avatar: '/blank.jpg', title: 'Winning Project Demo:'}
    ]

    return (
        <Container>
            <HeroBanner>
                <HeroTitle>PL8M8 Hackathon 2024</HeroTitle>
            </HeroBanner>

            <Section>
                <SubHeading>Theme</SubHeading>
                <p>Driving Solutions: Innovating Car Maintenance and On-Road Experiences through Software</p>
                <p><strong>Platform and Tools</strong></p>
                <p>
                    Communication will be through Discord. Please follow the link 
                    <Link href="https://discord.gg/PcDgbp7XFK" target="_blank" rel="noopener noreferrer">
                        [[[ HERE ]]]
                    </Link>, and stay tuned for announcements there!
                </p>
                <p>Project submission tool: Submissions will be through Devpost, and submission link will be released on Discord and here once the event starts.</p>
                <p><strong>Exciting Prizes</strong></p>
                <p>Amazon gift cards for Best Overall and Best Use of Technology.</p>
                <p><strong>Judging</strong></p>
                <p>Judging rubric will be shared on Discord ahead of time.</p>
            </Section>

            <Section>
                <SubHeading>Hackathon Agenda</SubHeading>
                <p>Event Day: Online Hackathon on Sunday, Aug 3rd (all times in EST)</p>
                <List>
                    <ListItem>09:00 AM - 09:30 AM: Opening Ceremony
                        <List>
                            <ListItem>Welcome and introduction to the hackathon theme.</ListItem>
                            <ListItem>Overview of the schedule, rules, and platform navigation.</ListItem>
                            <ListItem>Introduction of organizing company and judges.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>09:30 AM - 10:00 AM: Team Formation (optional) and Idea Brainstorming
                        <List>
                            <ListItem>Participants form teams or decide to work individually. 1-2 people/team.</ListItem>
                            <ListItem>Teams brainstorm project ideas and finalize their concepts.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>10:00 AM - 01:00 PM: Hacking Session 1
                        <List>
                            <ListItem>Teams work on their projects.</ListItem>
                            <ListItem>Judges available for consultation and support.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>01:00 PM - 02:00 PM: Lunch Break and Check-in
                        <List>
                            <ListItem>Teams take a break and have a virtual check-in with organizers.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>02:00 PM - 05:00 PM: Hacking Session 2
                        <List>
                            <ListItem>Continued work on projects.</ListItem>
                            <ListItem>Optional virtual workshops or lightning talks.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>05:00 PM - 06:00 PM: Final Submissions and Demo Preparation
                        <List>
                            <ListItem>Teams submit their projects and prepare for demos.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>06:00 PM - 07:30 PM: Project Presentations and Demos
                        <List>
                            <ListItem>Each team presents their project to the judges (5 minutes per team), or submit project on Devpost with a description.</ListItem>
                            <ListItem>Judges evaluate the projects based on set criteria.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>07:30 PM - 08:00 PM: Judging Deliberation and Networking
                        <List>
                            <ListItem>Judges deliberate on the winners.</ListItem>
                            <ListItem>Participants can network and share experiences.</ListItem>
                        </List>
                    </ListItem>
                    <ListItem>08:00 PM - 08:30 PM: Closing Ceremony and Awards
                        <List>
                            <ListItem>Announcement of winners and distribution of prizes.</ListItem>
                            <ListItem>Closing remarks and thank yous.</ListItem>
                        </List>
                    </ListItem>
                </List>
            </Section>
                <SubHeading>Judging Panel</SubHeading>
                <JudgeContainer>
                    {judges.map((judge, index) => (
                        <JudgeCard key={index}>
                            <JudgeImage 
                                src={judge.avatar} 
                                alt={`${judge.name}'s avatar`} 
                            />
                            <JudgeName>{judge.name}</JudgeName>
                            <JudgeTitle>{judge.title}</JudgeTitle>
                        </JudgeCard>
                    ))}
                </JudgeContainer>
                <SubHeading>Winner</SubHeading>
                <JudgeContainer>
                    {winners.map((judge, index) => (
                        <JudgeCard key={index}>
                            <JudgeImage 
                                src={judge.avatar} 
                                alt={`${judge.name}'s avatar`} 
                            />
                            <JudgeName>{judge.name}</JudgeName>
                            <JudgeTitle>{judge.title}</JudgeTitle>
                            <Link 
                                href="https://www.youtube.com/watch?v=8nvJNLMSbOs" 
                                target="_blank" rel="noopener noreferrer">
                                Project Demo
                            </Link>
                            <br/>
                            <br/>
                            <Link 
                                href="https://car-care-control.onrender.com/" 
                                target="_blank" rel="noopener noreferrer">
                                Try it out!
                            </Link>
                            <br/>
                            <br/>
                            <Link 
                                href="https://github.com/MukeshAofficial/Car-Care-Control/" 
                                target="_blank" rel="noopener noreferrer">
                                Github Repo
                            </Link>
                        </JudgeCard>
                    ))}
                </JudgeContainer>
        </Container>
    );
};

export default Hackathon;
