const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface CareerAnalysis {
  roles: string[];
  skillGaps: string[];
  courses: string[];
  rewrittenResume: string;
}

export async function analyzeCareer(resume: string, careerPath: string, apiKey: string): Promise<CareerAnalysis> {
  const prompt = `You are an AI career advisor.

Analyze this resume and do the following:

1. Suggest 3 suitable tech roles that align with the career path "${careerPath}".
2. Highlight the key skill gaps that need to be filled for the "${careerPath}" role.
3. Recommend 3 specific online courses that would help bridge these skill gaps.
4. Rewrite the resume to fit the selected career path: ${careerPath}.

Please format your response as JSON with the following structure:
{
  "roles": ["role1", "role2", "role3"],
  "skillGaps": ["gap1", "gap2", "gap3"],
  "courses": ["course1", "course2", "course3"],
  "rewrittenResume": "complete rewritten resume text"
}

Resume:
${resume}`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  const responseText = data.candidates[0].content.parts[0].text;
  
  try {
    // Try to parse JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    
    return {
      roles: parsedResponse.roles || [],
      skillGaps: parsedResponse.skillGaps || [],
      courses: parsedResponse.courses || [],
      rewrittenResume: parsedResponse.rewrittenResume || ''
    };
  } catch (parseError) {
    // Fallback: parse the response manually if JSON parsing fails
    const lines = responseText.split('\n');
    const roles: string[] = [];
    const skillGaps: string[] = [];
    const courses: string[] = [];
    let rewrittenResume = '';
    
    let currentSection = '';
    let resumeStarted = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('roles') || trimmedLine.toLowerCase().includes('positions')) {
        currentSection = 'roles';
        continue;
      } else if (trimmedLine.toLowerCase().includes('skill gaps') || trimmedLine.toLowerCase().includes('skills')) {
        currentSection = 'skillGaps';
        continue;
      } else if (trimmedLine.toLowerCase().includes('courses') || trimmedLine.toLowerCase().includes('training')) {
        currentSection = 'courses';
        continue;
      } else if (trimmedLine.toLowerCase().includes('resume') || trimmedLine.toLowerCase().includes('cv')) {
        currentSection = 'resume';
        resumeStarted = true;
        continue;
      }
      
      if (trimmedLine.match(/^\d+\./) || trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
        const content = trimmedLine.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '');
        
        if (currentSection === 'roles' && roles.length < 3) {
          roles.push(content);
        } else if (currentSection === 'skillGaps' && skillGaps.length < 3) {
          skillGaps.push(content);
        } else if (currentSection === 'courses' && courses.length < 3) {
          courses.push(content);
        }
      } else if (currentSection === 'resume' && resumeStarted && trimmedLine) {
        rewrittenResume += line + '\n';
      }
    }
    
    return {
      roles: roles.length > 0 ? roles : ['Frontend Developer', 'UI/UX Developer', 'Web Developer'],
      skillGaps: skillGaps.length > 0 ? skillGaps : ['Modern JavaScript frameworks', 'Responsive design', 'Version control (Git)'],
      courses: courses.length > 0 ? courses : ['Complete React Developer Course', 'Advanced CSS and JavaScript', 'Git and GitHub Masterclass'],
      rewrittenResume: rewrittenResume || 'Unable to rewrite resume. Please check your input and try again.'
    };
  }
}