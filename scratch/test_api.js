async function testJudge0WithStdin() {
  const code = `#include <iostream>
using namespace std;
int main() {
    int a, b;
    if (cin >> a >> b) {
        cout << "Sum: " << (a + b) << endl;
    } else {
        cout << "No input provided" << endl;
    }
    return 0;
}`;

  try {
    const res = await fetch('https://ce.judge0.com/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: 54, // C++ (GCC 9.2.0)
        stdin: '15 25'
      })
    });
    console.log('Judge0 Status:', res.status);
    const data = await res.json();
    console.log('Judge0 Result:\n', data.stdout || data.stderr || data.compile_output);
  } catch (err) {
    console.error('Judge0 Error:', err);
  }
}

testJudge0WithStdin();
