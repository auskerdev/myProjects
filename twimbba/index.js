
import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', (e) => {
   if (e.target.dataset.like) {
      handleLikeClick(e.target.dataset.like)
   } else if (e.target.dataset.retweet) {
      handleRetweetClick(e.target.dataset.retweet)
   } else if (e.target.dataset.reply) {
      handleReplyClick(e.target.dataset.reply)
   } else if (e.target.id === 'tweet-btn') {
      tweetBtn()
   }
})

function tweetBtn () {
   const tweetInput = document.getElementById('tweet-input')
   const tweetInputValue = tweetInput.value
   
   const tweetObj = {
      handle: `@TweeterUser 💎`,
      profilePic: `car8.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInputValue,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
   }

   if (tweetInput.value) {
      tweetsData.unshift(tweetObj)
      tweetInput.value = ''
      render()
   }
}

function handleReplyClick (tweetID) {
   document.getElementById(`reply-${tweetID}`).classList.toggle('hidden')
}

function handleRetweetClick (tweetID) {
   const currentItem = tweetsData.filter((tweet) => {
      return tweet.uuid === tweetID
   })[0]
   
   if (currentItem.isRetweeted) {
      currentItem.retweets--
   } else {
      currentItem.retweets++
   }

   currentItem.isRetweeted = !currentItem.isRetweeted
   render()
}

function handleLikeClick (tweetID) {
   const currentItem = tweetsData.filter((tweet) => {
      return tweet.uuid === tweetID
   })[0]
   
   if (currentItem.isLiked) {
      currentItem.likes--
   } else {
      currentItem.likes++
   }

   currentItem.isLiked = !currentItem.isLiked
   render()
}

function getFeedHTML () {

   let feedHTML = ''
   let replyHTML = ''
   tweetsData.forEach((tweet) => {

      let likeIconClass = ''
      let retweetIconClass = ''

      if (tweet.isLiked) {
         likeIconClass = 'liked'
      }
      if (tweet.isRetweeted) {
         retweetIconClass = 'retweeted'
      }

      if(tweet.replies.length > 0) {
         tweet.replies.forEach((reply) => {
            replyHTML += `
            <div class='reply-feed'>
               <div>
                  <img src=${reply.profilePic} />
               </div>
               <div>
                  <h5>${reply.handle}</h5>
                  <p>${reply.tweetText}</p>
               </div>
            </div>`
         })
      }

      feedHTML += `
      <div class='feed-container'>
         <div>
            <img src=${tweet.profilePic} class='feed-img' />
         </div>
         <div>
            <h5>${tweet.handle}</h5>
            <p>${tweet.tweetText}</p>
            <div class='span-container'>
               <span>
                  <i class="fa-solid fa-comment-dots" data-reply='${tweet.uuid}'></i>
                  ${tweet.replies.length}
               </span>
               <span>
                  <i class="fa-solid fa-heart ${likeIconClass}" data-like='${tweet.uuid}'></i>
                  ${tweet.likes}
               </span>
               <span>
                  <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet='${tweet.uuid}'></i>
                  ${tweet.retweets}
               </span>
            </div>
         </div>
      </div>
      <div class='hidden' id='reply-${tweet.uuid}'>
         ${replyHTML}
      </div>
      `
   })
   return feedHTML
}

function render () {
   document.getElementById('feed').innerHTML = getFeedHTML()
}

render()