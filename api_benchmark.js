import autocannon from 'autocannon';
import { PassThrough } from 'stream'

function run(url) {
  const buf = [];
  const outputStream = new PassThrough();

  const inst = autocannon({
    url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            "acc": "4",
            "topic": "test1",
            "username": "haivl"
        }          
    ),
    connections: 500, // số lượng kết nối đồng thời
    duration: 30, // thời gian chạy kiểm thử là 30 giây
  });

  autocannon.track(inst, { outputStream });

  outputStream.on('data', data => buf.push(data));
  inst.on('done', () => {
    process.stdout.write(Buffer.concat(buf));
  });
}

console.log('Running all benchmarks in parallel ...');

run('http://localhost:8181/api/acl');