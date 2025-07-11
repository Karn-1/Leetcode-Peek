////////////////////////////////////////
document.addEventListener("DOMContentLoaded",function(){
  const searchButton= document.getElementById('search-btn');
  const usernameInput = document.getElementById('user-input');
  const statsContainer = document.querySelector('.stats-container');

  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");

  const easyLabel = document.getElementById("easy-label")
  const mediumLabel = document.getElementById("medium-label")
  const hardLabel = document.getElementById("hard-label");
  // to populate the cards 
 const cardStatsContainer = document.querySelector(".stats-cards");

 const forRank =document.getElementById('forRank');

  /// return true or false based on a regex
  function validateUsername(username){
    if(username.trim() === "" ){
      alert("Username should not be empty");
      return false;
    }
    //“Only allow usernames that are 1–15 characters long, and contain only letters, numbers, underscores, or hyphens—no spaces, no special symbols like @ or #.”
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);

    // example 
    //regex.test("Mohit_123") // ✅ true
    //regex.test("Mohit@copilot")  // ❌ false (contains "@")

    if(!isMatching){
      alert("Invalid username");
    }
    return isMatching;  // when the valid username 
  }

  async function fetchUserDetails(username) {
   
    try{

      // making like we searching and disable button
      searchButton.textContent = "searching...";
      searchButton.disabled =true;

     

      statsContainer.style.display = 'none';


      const proxyurl = 'https://cors-anywhere.herokuapp.com/';

      const targeturl = 'https://leetcode.com/graphql/'

      const myHeaders = new Headers();
      myHeaders.append("content-type" , "application/json");
      
      const graphql = JSON.stringify({
        query: `
          query userSessionProgress($username: String!) {
            allQuestionsCount {
              difficulty
              count
            }
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
              profile {
                ranking
              }
            }
          }
        `,
        variables: { username }
});
    const requestOptions = {
      method:"POST",
      headers:myHeaders,
      body:graphql,
    };

    const response = await fetch(proxyurl + targeturl,requestOptions);

      if(!response.ok){
        throw new Error("Unable to fetch the User details");
      }
     
      const parsedData = await response.json();
      console.log("Logging data " , parsedData);

      displayUserData(parsedData);
    }

    catch(error){
      statsContainer.innerHTML = `${error} this is message coming`
    }

    finally{
      searchButton.textContent = 'Search';
      searchButton.disabled  = false;
    }
  }

  // function ot update the process
  function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

  function displayUserData(parsedData) {
  statsContainer.style.display = 'block';

  // 2) Pull out the ranking
  const rank = parsedData.data.matchedUser.profile.ranking;

  // 3) Pull out all your other submission stats
  const totalEasyQues   = parsedData.data.allQuestionsCount[1].count;
  const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
  const totalHardQues   = parsedData.data.allQuestionsCount[3].count;

  const solvedEasy   = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
  const solvedMedium = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
  const solvedHard   = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

  // 4) Update your progress circles
  updateProgress(solvedEasy,   totalEasyQues,   easyLabel,   easyProgressCircle);
  updateProgress(solvedMedium, totalMediumQues, mediumLabel, mediumProgressCircle);
  updateProgress(solvedHard,   totalHardQues,   hardLabel,   hardProgressCircle);

 
  // 5) Build your cards array—insert the rank as the very first card
  const cardsData = [
    { label: "Overall Submissions :",    value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
    { label: "Easy Submissions :",       value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
    { label: "Medium Submissions :",     value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
    { label: "Hard Submissions :",       value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
  ];

  function formatIndianRank(rank) {
  return rank.toLocaleString('en-IN'); // "en-IN" formats using Indian commas
}
    
  console.log(rank)
  let ProperRank = formatIndianRank(rank);
  forRank.innerHTML = `
  <h2>Global Rank :
  <span>${ProperRank}</span> </h2>
`;

  // 6) Render them into your .stats-cards container
  cardStatsContainer.innerHTML = cardsData.map(d => `
    <div class="card new">
      <h4>${d.label}
      <span>${d.value}</span> </h4>
    </div>
  `).join("");
}

  searchButton.addEventListener('click' , function(){
    const username = usernameInput.value;
    console.log("Loggin username" , username);

    if(validateUsername(username)){
      // when its vlaid then pass into the api call fetching from the api passing username
      fetchUserDetails(username);
    }

  })

})
