export const invokeShare = (data) => {
    navigator.share({title: `InstiLeaks`, text:`Post by ${data.name?data.name:"Anonymous"}\n${data.url}` , url: data.url})
          .then(() => console.log('Successful share'),
           error => console.log('Error sharing:', error));
};