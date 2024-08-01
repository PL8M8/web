// pages/hackathon.js
import React from 'react';

const Hackathon = () => {
    const judges = [
        { name: 'Akanksha', title: 'Lead Organizer', avatar: '/path/to/avatar1.jpg' },
        { name: 'John Doe', title: 'Tech Lead', avatar: '/path/to/avatar2.jpg' },
        { name: 'Jane Smith', title: 'Product Manager', avatar: '/path/to/avatar3.jpg' },
        { name: 'Sam Wilson', title: 'UX Designer', avatar: '/path/to/avatar4.jpg' },
      ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Online Hackathon Agenda and Plan</h1>
      
      <section>
        <h2>Pre-Hackathon Preparations</h2>
        <p><strong>Define the Theme and Goals</strong></p>
        <p>Theme: Driving Solutions: Innovating Car Maintenance and On-Road Experiences through Software</p>
        <p><strong>Platform and Tools</strong></p>
        <p>
          Communication will be through a Discord server. We can create a new channel on the Code Coalition server for this and add a link to this on the landing page. If desired, we can set up communication channels for announcements, voice channels for demos, etc.
        </p>
        <p>Project submission tool: Devpost</p>
        <p><strong>Sponsorship and Prizes</strong></p>
        <p>1st prize, 2nd prize: Amazon gift cards, or different categories such as Best Overall, Best Use of Technology.</p>
        <p>Sponsored by Akanksha</p>
        <p><strong>Judging</strong></p>
        <p>Judges: Akanksha, TBD</p>
        <p>Share judging rubric ahead of time</p>
        <p><strong>Marketing</strong></p>
        <p>Promote the hackathon through Meetup event, Discord, and Reddit</p>
      </section>

      <section>
        <h2>Hackathon Agenda</h2>
        <p>Event Day: Online Hackathon on Sunday, Aug 3rd (all times in EST)</p>
        <ul>
          <li>09:00 AM - 09:30 AM: Opening Ceremony</li>
          <ul>
            <li>Welcome and introduction to the hackathon theme.</li>
            <li>Overview of the schedule, rules, and platform navigation.</li>
            <li>Introduction of organizing company and judges.</li>
          </ul>
          <li>09:30 AM - 10:00 AM: Team Formation (optional) and Idea Brainstorming</li>
          <ul>
            <li>Participants form teams or decide to work individually. 1-2 people/team.</li>
            <li>Teams brainstorm project ideas and finalize their concepts.</li>
          </ul>
          <li>10:00 AM - 01:00 PM: Hacking Session 1</li>
          <ul>
            <li>Teams work on their projects.</li>
            <li>Judges available for consultation and support.</li>
          </ul>
          <li>01:00 PM - 02:00 PM: Lunch Break and Check-in</li>
          <ul>
            <li>Teams take a break and have a virtual check-in with organizers.</li>
          </ul>
          <li>02:00 PM - 05:00 PM: Hacking Session 2</li>
          <ul>
            <li>Continued work on projects.</li>
            <li>Optional virtual workshops or lightning talks.</li>
          </ul>
          <li>05:00 PM - 06:00 PM: Final Submissions and Demo Preparation</li>
          <ul>
            <li>Teams submit their projects and prepare for demos.</li>
          </ul>
          <li>06:00 PM - 07:30 PM: Project Presentations and Demos</li>
          <ul>
            <li>Each team presents their project to the judges (5 minutes per team), or submit project on Devpost with a description.</li>
            <li>Judges evaluate the projects based on set criteria.</li>
          </ul>
          <li>07:30 PM - 08:00 PM: Judging Deliberation and Networking</li>
          <ul>
            <li>Judges deliberate on the winners.</li>
            <li>Participants can network and share experiences.</li>
          </ul>
          <li>08:00 PM - 08:30 PM: Closing Ceremony and Awards</li>
          <ul>
            <li>Announcement of winners and distribution of prizes.</li>
            <li>Closing remarks and thank yous.</li>
          </ul>
        </ul>
      </section>

      <section>
        <h2>Post-Hackathon Activities</h2>
        <p><strong>Follow-Up</strong></p>
        <p>Send thank-you emails to participants, sponsors, judges, and volunteers.</p>
        <p>Share event highlights, recordings, and winning projects through Discord.</p>
      </section>

      <section>
        <h2>Judging Panel</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
          {judges.map((judge, index) => (
            <div key={index} style={{ textAlign: 'center', width: '150px' }}>
              <img 
                src={judge.avatar} 
                alt={`${judge.name}'s avatar`} 
                style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
              />
              <p style={{ fontWeight: 'bold', margin: '10px 0 5px' }}>{judge.name}</p>
              <p style={{ margin: 0 }}>{judge.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hackathon;
