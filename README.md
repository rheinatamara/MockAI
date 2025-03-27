# MockAI API Documentation

## **Endpoints** :

List of available endpoints:

| Method   | Endpoint                           | Description                            |
| -------- | ---------------------------------- | -------------------------------------- |
| `POST`   | `/register`                        | To create a new user.                  |
| `POST`   | `/login`                           | To log in user.                        |
| `POST`   | `/google-login`                    | To log in user via google.             |
| `GET`    | `/user`                            | To get user data                       |
| `PUT`    | `/update`                          | To update user data                    |
| `GET`    | `/interview/active`                | To fetch active interviews             |
| `GET`    | `/interview/:interviewId`          | To fetch an interview detail by ID     |
| `GET`    | `/interview/:interviewId/feedback` | To fetch Feedback by interview ID      |
| `POST`   | `/interview`                       | To generate interview questions        |
| `POST`   | `/interview/:interviewId/feedback` | To generate AI feedback from interview |
| `DELETE` | `/interview/:interviewId`          | To delete an interview                 |

&nbsp;

## 1. POST /register

Request:

- body:

```json
{
  "email": "hello@world.com",
  "password": "123456"
}
```

_Response (200 - OK)_

```json
{
  "id": 4,
  "email": "rheina@mail.com"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": ["email must be unique"]
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": ["Name is required"]
}
```

&nbsp;

## 2. POST /login

Request:

- body:

```json
{
  "email": "hello@world.com",
  "password": "123456"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "<access_token>"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email and password are required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email / password"
}
```

&nbsp;

## 3. POST /google-login

Request:

- body:

```json
{
  "googleToken": "<google_access_token>"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "<access_token>"
}
```

&nbsp;

## 4. POST /user

**REQUEST**

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "email": "hello@world.com"
}
```

## 5. PUT /update

**REQUEST**

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "email": "john@mail.com",
  "password": "12345"
}
```

_Response (200 - OK)_

```json
{
  "message": "Profile updated successfully"
}
```

## 6. GET /interview/active

**REQUEST**

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 5,
    "role": "Full Stack",
    "level": "Junior",
    "questions": [
      "Describe a time you encountered a challenging bug while working on a project using React, and how you approached troubleshooting and resolving it."
    ],
    "techstack": ["React"],
    "userId": 1,
    "type": "Behavioral",
    "finalized": false,
    "createdAt": "2025-03-27T04:11:30.238Z",
    "updatedAt": "2025-03-27T04:11:30.238Z",
    "Feedbacks": []
  }
]
```

## 7. GET /interview/completed

**REQUEST**

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "role": "Frontend Developer",
    "level": "Mid-level",
    "questions": [
      "Explain the Virtual DOM in React",
      "How would you optimize a slow React application?",
      "Describe your experience with state management"
    ],
    "techstack": ["React", "JavaScript", "TypeScript", "CSS"],
    "userId": 1,
    "type": "Technical",
    "finalized": true,
    "createdAt": "2025-03-27T03:18:36.252Z",
    "updatedAt": "2025-03-27T03:18:36.252Z",
    "Feedbacks": [
      {
        "createdAt": "Mar 27, 2025",
        "id": 1,
        "totalScore": 85
      }
    ]
  },
  {
    "id": 4,
    "role": "Full Stack Developer",
    "level": "Entry-level",
    "questions": [
      "Explain the MVC pattern",
      "How would you implement authentication?",
      "What's your experience with testing?"
    ],
    "techstack": ["React", "Node.js", "MongoDB", "Express"],
    "userId": 1,
    "type": "Technical",
    "finalized": true,
    "createdAt": "2025-03-27T03:18:36.252Z",
    "updatedAt": "2025-03-27T03:18:36.252Z",
    "Feedbacks": [
      {
        "createdAt": "Mar 27, 2025",
        "id": 3,
        "totalScore": 70
      }
    ]
  }
]
```

## 8. GET /interview/:interviewId

**REQUEST**

- params:

```json
{
  "id": 6
}
```

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "id": 2,
  "role": "Backend Engineer",
  "level": "Senior",
  "questions": [
    "Explain REST vs GraphQL",
    "How would you design a scalable microservice architecture?",
    "Describe your approach to database optimization"
  ],
  "techstack": ["Node.js", "PostgreSQL", "Docker", "AWS"],
  "userId": 2,
  "type": "Technical",
  "finalized": true,
  "createdAt": "2025-03-27T03:18:36.252Z",
  "updatedAt": "2025-03-27T03:18:36.252Z",
  "Feedbacks": [
    {
      "createdAt": "Mar 27, 2025",
      "id": 2,
      "totalScore": 92,
      "categoryScores": [
        {
          "name": "System Design",
          "score": 95,
          "comment": "Exceptional architectural thinking"
        },
        {
          "name": "Database Knowledge",
          "score": 90,
          "comment": "Deep understanding of PostgreSQL optimization"
        },
        {
          "name": "Cloud Experience",
          "score": 90,
          "comment": "Strong AWS knowledge"
        }
      ],
      "strengths": [
        "Excellent system design skills",
        "Deep database knowledge",
        "Clear leadership potential"
      ],
      "areasForImprovement": [
        "Could discuss more failure scenarios",
        "More cost optimization strategies"
      ],
      "finalAssessment": "Outstanding senior candidate with strong backend expertise. Ready for architect-level challenges."
    }
  ]
}
```

## 7. GET /interview/:interviewId/feedback

**REQUEST**

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "id": 2
}
```

_Response (200 - OK)_

```json
[
  {
    "createdAt": "Mar 27, 2025",
    "id": 2,
    "totalScore": 92,
    "categoryScores": [
      {
        "name": "System Design",
        "score": 95,
        "comment": "Exceptional architectural thinking"
      },
      {
        "name": "Database Knowledge",
        "score": 90,
        "comment": "Deep understanding of PostgreSQL optimization"
      },
      {
        "name": "Cloud Experience",
        "score": 90,
        "comment": "Strong AWS knowledge"
      }
    ],
    "strengths": [
      "Excellent system design skills",
      "Deep database knowledge",
      "Clear leadership potential"
    ],
    "areasForImprovement": [
      "Could discuss more failure scenarios",
      "More cost optimization strategies"
    ],
    "finalAssessment": "Outstanding senior candidate with strong backend expertise. Ready for architect-level challenges."
  }
]
```

_Response (404 - Not Found)_

```json
{
  "message": "Interview not found or not finalized"
}
```

## 8. POST /interview

**REQUEST**

- params:

```json
{
  "id": 6
}
```

- body:

```json
{
  "type": "behavioral",
  "role": "Frontend Developer",
  "level": "Junior",
  "techstack": "React, Node.js",
  "amount": 5
}
```

_Response (201 - OK)_

```json
{
  "id": 25,
  "role": "Frontend Developer",
  "type": "behavioral",
  "level": "Junior",
  "techstack": ["React", " Node.js"],
  "questions": [
    "Tell me about a time you faced a challenging problem while working on a project. What steps did you take to overcome it, and what did you learn from the experience?",
    "Describe a situation where you had to work with someone who had a different working style than your own. How did you adapt, and what was the outcome?",
    "Share an example of a time you received constructive criticism. How did you react to the feedback, and how did you use it to improve your skills?",
    "Tell me about a project where you had to learn a new technology or skill quickly. What was your approach to learning it, and how did you apply it to the project?",
    "Describe a time you made a mistake on a project. What did you do to rectify the situation, and what preventative measures did you take to avoid similar mistakes in the future?"
  ],
  "userId": 4,
  "finalized": false,
  "updatedAt": "2025-03-27T02:13:43.607Z",
  "createdAt": "2025-03-27T02:13:43.607Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden error"
}
```

## 9️⃣ DELETE products/:id

**REQUEST**

- params:

```json
{
  "id": 6
}
```

_Response (200 - OK)_

```json
{
  "message": "product is deleted successfully"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden error"
}
```

## 📌 Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid Token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

## 8. DELETE /interview/:interviewId

**REQUEST**

- params:

```json
{
  "id": 6
}
```

- header:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "message": "Interview deleted successfully"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Interview not found"
}
```
