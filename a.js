// unit -> lesson
// 4 -> 17-21
// 5 -> 22-25
// 6 -> 26-29
// 7 -> 30-33
// 8 -> 34-37

const fs = require('fs')

const unit2lesson = new Map();
unit2lesson.set(4, { start: 17, end: 21 });
unit2lesson.set(5, { start: 22, end: 25 });
unit2lesson.set(6, { start: 26, end: 29 });
unit2lesson.set(7, { start: 30, end: 33 });
unit2lesson.set(8, { start: 34, end: 37 });

[...unit2lesson].forEach(([unit, { start, end }]) => {
  for (let lesson = start; lesson <= end; lesson++) {
    const tmpDir = `${__dirname}/unit_${unit}/lesson_${lesson}`;
    fs.mkdirSync(tmpDir);
    fs.writeFileSync(`${tmpDir}/README.md`, `# メモ`);
  }
});


