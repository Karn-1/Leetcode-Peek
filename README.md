 Excited to share my latest mini-project: LeetCode Peek!
I built a simple UI where you enter your LeetCode username and instantly get:
• Your global rank
• Easy / Medium / Hard problems solved
• Total submissions
Along the way I practiced:
• Async JavaScript functions
• GraphQL API calls (via a CORS proxy)
• Dynamic DOM updates with HTML & CSS


Originally, I tried a direct fetch to LeetCode’s GraphQL endpoint but ran into CORS errors. To work around it, I routed my request through 
the demo proxy at https://cors-anywhere.herokuapp.com/:

const proxyurl  = 'https://cors-anywhere.herokuapp.com/';

This simple hack let me pull in the data flawlessly.
