$(document).ready(loadCanvasAnimate);
window.addEventListener('pjax:complete', loadCanvasAnimate);
function loadCanvasAnimate() {
  const clientWidth = document.documentElement.clientWidth;
  const clientHeight = document.documentElement.clientHeight;

  let canvas = document.querySelector('#canvas');
  if (!canvas) return;
  let ctx = canvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

  const dpi = dpr / bsr;
  canvas.style.width = `${clientWidth}px`;
  canvas.style.height = `${clientHeight}px`;
  canvas.width = clientWidth * dpi;
  canvas.height = clientHeight * dpi;
  ctx.scale(dpi, dpi);

  ctx.strokeStyle = '#88888825';
  // 计算树枝长度的系数
  const branchLengthFactor = clientWidth <= 800 ? 2 : 4;

  const randomInt = (e, t) => {
    return Math.floor(Math.random() * (t - e) + e);
  };

  // 计算树枝的结束点坐标
  function calculateEndPos(branch) {
    return {
      x: branch.start.x + branch.length * Math.cos(branch.theta),
      y: branch.start.y + branch.length * Math.sin(branch.theta),
    };
  }

  function drawLine(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  // 存储生成的所有树枝的数组
  let branches = [];
  // 递归生成树枝
  function generateBranches(branch, depth = 0) {
    const endPos = calculateEndPos(branch);
    // 绘制当前树枝
    drawLine(branch.start, endPos);

    // depth === 20 && (ctx.strokeStyle = '#ffffff2e');
    // 在数组中存储生成子树枝的函数
    (depth < 4 || (Math.random() < 0.5 && !(depth > 300))) &&
      branches.push(() =>
        generateBranches(
          {
            start: endPos,
            length: randomInt(1, 8),
            theta: branch.theta - 0.2 * Math.random(),
          },
          depth + 1
        )
      );

    (depth < 4 || (Math.random() < 0.5 && !(depth > 300))) &&
      branches.push(() =>
        generateBranches(
          {
            start: endPos,
            length: randomInt(1, 8),
            theta: branch.theta + 0.2 * Math.random(),
          },
          depth + 1
        )
      );
  }

  generateBranches({
    start: {
      x: randomInt(150, clientWidth / 1.5),
      y: 0,
    },
    length: branchLengthFactor,
    theta: Math.PI / 1.8,
  });
  generateBranches({
    start: {
      x: 0,
      y: randomInt(0, clientHeight),
    },
    length: branchLengthFactor,
    theta: -Math.PI / 4,
  });
  generateBranches({
    start: {
      x: clientWidth,
      y: randomInt(0, clientHeight - 200),
    },
    length: branchLengthFactor,
    theta: Math.PI,
  });
  generateBranches({
    start: {
      x: randomInt(150, clientWidth / 1.5),
      y: clientHeight,
    },
    length: branchLengthFactor,
    theta: -Math.PI / 2,
  });

  // 随机删除一些树枝
  function pruneBranches() {
    const newBranches = [];
    branches = branches.filter((branch) => {
      if (Math.random() > 0.4) {
        newBranches.push(branch);
        return false;
      }
      return true;
    });
    // 递归生成新的树枝
    newBranches.forEach((branch) => branch());
  }

  let frameCount = 0;

  function animate() {
    requestAnimationFrame(() => {
      frameCount += 1;
      if (frameCount % 3 === 0) {
        pruneBranches();
      }
      if (branches.length !== 0) {
        animate();
      }
    });
  }

  animate();
}
