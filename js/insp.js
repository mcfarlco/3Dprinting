// Reddit Image Finder

var redditURLS = {
  threedprinting:{
    day:"https://www.reddit.com/r/3Dprinting/top/.json?t=week",
    week:"https://www.reddit.com/r/3Dprinting/top/.json?t=week",
    month:"https://www.reddit.com/r/3Dprinting/top/.json?t=week"
  },
  functionalprint:{
    day:"https://www.reddit.com/r/functionalprint/top/.json?t=week",
    week:"https://www.reddit.com/r/functionalprint/top/.json?t=week",
    month:"https://www.reddit.com/r/functionalprint/top/.json?t=week"
  },
  printedminis:{
    day:"https://www.reddit.com/r/PrintedMinis/top/.json?t=week",
    week:"https://www.reddit.com/r/PrintedMinis/top/.json?t=week",
    month:"https://www.reddit.com/r/PrintedMinis/top/.json?t=week"
  }
};
var imageIndex = 0;
var imageSlot = {day:"Day", week:"Week", month:"Month"};
var imageSubReddit = {td:"3d", fp:"fp", pm:"pm"}
var slotNum = 0;
var subRedditNum = 0;

function redditImages(){
  for (var subreddit in redditURLS){
    console.log(subreddit);
    for (var url in redditURLS[subreddit]){
      console.log(redditURLS[subreddit][url]);

      fetch(redditURLS[subreddit][url])
          .then(response => response.json())
          .then(data => addImages(findImages(data)));

      function findImages(data){
        var img;
        var imgData = data.data.children[imageIndex].data;

        if (imgData.media_metadata == null){
          if (imgData.secure_media == null){
            if (imgData.preview.images[0].variants == null || Object.keys(imgData.preview.images[0].variants).length === 0){
              img = new URL(imgData.preview.images[0].source.url);
            } else {
                img = new URL(imgData.preview.images[0].variants.gif.source.url);
            };
          } else {
              img = new URL(imgData.secure_media.reddit_video.fallback_url);
          };
        } else {
            var galleryID = imgData.gallery_data.items[0].media_id
            img = new URL(imgData.media_metadata[galleryID].s.u);
        };

        return img = img.toString().replace(/&amp;/g,"&");
      };

    function addImages(img){
      if (img.search(".mp4") > 0){
        var newImg = document.createElement("video");
        newImg.autoplay = true;
        newImg.loop = true;
      } else {
      var newImg = document.createElement("img");
      };

      newImg.setAttribute("src", img);

      console.log("rednum " + subRedditNum);
      console.log("slot " + slotNum);
      console.log(img)

      var elementID = imageSubReddit[Object.keys(imageSubReddit)[subRedditNum]] + imageSlot[Object.keys(imageSlot)[slotNum]];

      if (document.getElementById(elementID.toString()).firstChild != null) {
        document.getElementById(elementID.toString()).removeChild(document.getElementById(elementID.toString()).firstChild);
      };
      document.getElementById(elementID.toString()).appendChild(newImg);

      if (slotNum == 2){
        slotNum = 0;
        subRedditNum++;
      } else {
        imageIndex++;
        slotNum++;
        console.log("inc slot " + slotNum)
      };
    };
    };
  };

  event.preventDefault();


};

redditImages();
