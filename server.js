const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const multer = require('multer');

// 정적 파일 서비스 설정
app.use(express.static('public'));

// 파일 업로드를 위한 Multer 설정
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.gif');
  }
});
const upload = multer({ storage });

// 클라이언트 연결 이벤트 처리
io.on('connection', (socket) => {
  console.log('새로운 클라이언트가 연결되었습니다.');

  // 채팅 메시지 처리
  socket.on('chat-message', (data) => {
    io.emit('chat-message', data);
  });

  // 클라이언트 연결 종료 이벤트 처리
  socket.on('disconnect', () => {
    console.log('클라이언트 연결이 종료되었습니다.');
  });
});

// 파일 업로드 핸들러
app.post('/upload', upload.single('image'), (req, res) => {
  res.send(req.file.path);
});

// 서버 시작
const port = 3000;
http.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
