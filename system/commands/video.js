
const fs = require('fs');
const { exec } = require('child_process');
const { getRandom } = require('../myfunc.js');
const { toAudio } = require('../converter.js');
const { channelInfo} =require('../inf.js');

async function webp2mp4(source) {
  const fetch = require('node-fetch');
  const FormData = require('form-data');
  const cheerio = require('cheerio');

  let form = new FormData();
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
  
  form.append('new-image-url', isUrl ? source : '');
  form.append('new-image', isUrl ? '' : source, 'image.webp');
  
  let res = await fetch('https://ezgif.com/webp-to-mp4', {
    method: 'POST',
    body: form
  });
  
  let html = await res.text();
  let $ = cheerio.load(html);
  let form2 = new FormData();
  let obj = {};
  
  $('form input[name]').each((_, el) => {
    obj[$(el).attr('name')] = $(el).val();
    form2.append($(el).attr('name'), $(el).val());
  });
  
  let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
    method: 'POST',
    body: form2
  });
  
  let html2 = await res2.text();
  let $2 = cheerio.load(html2);
  return new URL($2('div#output > p.outfile > video > source').attr('src'), res2.url).toString();
}

async function volvideo({ ben, m, args, prefix, command }) {
  
  const quoted = m.quoted ? m.quoted : null;
  const mime = quoted?.mimetype || "";
      
    if (!args.join(" ")) {
        await ben.sendMessage(m.chat, {text: `*Example: ${prefix + command} 10*`,...channelInfo}, {quoted: m});
        }
      
   if (!quoted || !/video/.test(mime)) {
       await ben.sendMessage(m.chat, {text: `Reply to an *video file* with ${prefix + command}  to adjust volume.`,...channelInfo},{quoted: m});
       }

    try {
      const media = await ben.downloadAndSaveMediaMessage(quoted, "volume");
      const volvid = getRandom(".mp4");

      exec(`ffmpeg -i ${media} -filter:a volume=${args[0]} ${volvid}`, (err, stderr, stdout) => {
        fs.unlinkSync(media);
        if (err) {
            console.log(err);
}
        const files = fs.readFileSync(volvid);
        ben.sendMessage(
          m.chat,
          { video: files, mimetype: "video/mp4" },
          { quoted: m }
        );
        fs.unlinkSync(volvid);
      });
    } catch (error) {
      console.error('Error processing video:', error);
      await ben.sendMessage(m.chat, {text: 'An error occurred while processing the video.', ...channelInfo}, {quoted: m});
    }
  }


        
async function toaudio({ ben, m}) {
  const quoted = m.quoted ? m.quoted : null;
  const mime = quoted?.mimetype || "";
    if (!quoted) {
        await ben.sendMessage(m.chat, {text: '*Reply to a video to convert it to audio!*', ...channelInfo}, {quoted: m});
        }
    
    
    if (!/video/.test(mime)) {
        await ben.sendMessage(m.chat, {text: '*Only videos can be converted to audio!*', ...channelInfo},{quoted: m});
}
   
    try {
      let buffer = await quoted.download();
      let converted = await toAudio(buffer, 'mp4');

      await ben.sendMessage(m.chat, { audio: converted.data, mimetype: 'audio/mpeg' }, { quoted: m });
      await converted.delete();
    } catch (e) {
      console.error(e);
      await ben.sendMessage(m.chat, {text: '*Failed to convert video to audio!*', ...channelInfo}, {quoted: m});
    }
  }


  
 async function tovid({ ben, m, prefix, command }) {
    if (!m.quoted) {
        await ben.sendMessage(m.chat, {text: `Reply to a sticker with caption *${prefix + command}*`, ...channelInfo}, {quoted: m});
    }
       
    if (!m.quoted.mimetype.includes('webp')) {
    await ben.sendMessage(m.chat, {text:`Please reply to a webp sticker`, ...channelInfo}, {quoted: m});
        }
   
        
    try {
      const media = await m.quoted.download();
      const videoUrl = await webp2mp4(media);
      
      if (!videoUrl) throw new Error('Conversion failed');
      
      await ben.sendFile(m.chat, videoUrl, 'converted.mp4', '', m);
      
    } catch (error) {
      console.error(error);
      await ben.sendMessage(m.chat, {text: '❌ Failed to convert sticker to video. Please try again later.', ...channelInfo}, {quoted: m});
        
    }
  }



module.exports= {tovid, toaudio, volvideo};