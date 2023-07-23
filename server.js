// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const server = http.createServer((req, res) => {
//   const { method, url } = req;
//   const filePath = path.join(__dirname, "data.json");

//   if (method === "GET") {
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         res.statusCode = 500;
//         res.end(`Error reading file: ${err}`);
//       } else {
//         const records = JSON.parse(data);
//         if (url === "/") {
//           res.setHeader("Content-Type", "application/json");
//           res.end(JSON.stringify(records));
//         } else {
//           const id = parseInt(url.substring(1));
//           const record = records.find((r) => r.id === id);
//           if (record) {
//             res.setHeader("Content-Type", "application/json");
//             res.end(JSON.stringify(record));
//           } else {
//             res.statusCode = 404;
//             res.end(`Record not found: ${id}`);
//           }
//         }
//       }
//     });
//   } else if (method === "POST") {
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", () => {
//       const record = JSON.parse(body);
//       fs.readFile(filePath, (err, data) => {
//         if (err) {
//           res.statusCode = 500;
//           res.end(`Error reading file: ${err}`);
//         } else {
//           const records = JSON.parse(data);
//           const maxId = records.reduce((acc, cur) => Math.max(acc, cur.id), 0);
//           record.id = maxId + 1;
//           records.push(record);
//           fs.writeFile(filePath, JSON.stringify(records), (err) => {
//             if (err) {
//               res.statusCode = 500;
//               res.end(`Error writing file: ${err}`);
//             } else {
//               res.setHeader("Content-Type", "application/json");
//               res.end(JSON.stringify(record));
//             }
//           });
//         }
//       });
//     });
//   } else if (method === "PUT") {
//     const id = parseInt(url.substring(1));
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", () => {
//       const record = JSON.parse(body);
//       fs.readFile(filePath, (err, data) => {
//         if (err) {
//           res.statusCode = 500;
//           res.end(`Error reading file: ${err}`);
//         } else {
//           const records = JSON.parse(data);
//           const index = records.findIndex((r) => r.id === id);
//           if (index === -1) {
//             res.statusCode = 404;
//             res.end(`Record not found: ${id}`);
//           } else {
//             record.id = id;
//             records[index] = record;
//             fs.writeFile(filePath, JSON.stringify(records), (err) => {
//               if (err) {
//                 res.statusCode = 500;
//                 res.end(`Error writing file: ${err}`);
//               } else {
//                 res.setHeader("Content-Type", "application/json");
//                 res.end(JSON.stringify(record));
//               }
//             });
//           }
//         }
//       });
//     });
//   } else if (method === "DELETE") {
//     const id = parseInt(url.substring(1));
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         res.statusCode = 500;
//         res.end(`Error reading file: ${err}`);
//       } else {
//         const records = JSON.parse(data);
//         const index = records.findIndex((r) => r.id === id);
//         if (index === -1) {
//           res.statusCode = 404;
//           res.end(`Record not found: ${id}`);
//         } else {
//           records.splice(index, 1);
//           fs.writeFile(filePath, JSON.stringify(records), (err) => {
//             if (err) {
//               res.statusCode = 500;
//               res.end(`Error writing file: ${err}`);
//             } else {
//               res.end(`Record deleted: ${id}`);
//             }
//           });
//         }
//       }
//     });
//   } else {
//     res.statusCode = 405;
//     res.end();
//   }
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });




const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const filePath = path.join(__dirname, "data.json");

  if (method === "GET") {
    if (url === "/") {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error reading file: ${err}`);
        } else {
          const records = JSON.parse(data);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(records));
        }
      });
    } else if (url.startsWith("/search?")) {
      const params = new URLSearchParams(url.substring(url.indexOf("?")));
      const criteria = params.get("criteria");
      const value = params.get("value");
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error reading file: ${err}`);
        } else {
          const records = JSON.parse(data);
          const filtered = records.filter(
            (record) => record[criteria] === value
          );
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(filtered));
        }
      });
    } else {
      const id = parseInt(url.substring(1));
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error reading file: ${err}`);
        } else {
          const records = JSON.parse(data);
          const record = records.find((r) => r.id === id);
          if (record) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(record));
          } else {
            res.statusCode = 404;
            res.end(`Record not found: ${id}`);
          }
        }
      });
    }
  } else if (method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const record = JSON.parse(body);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error reading file: ${err}`);
        } else {
          const records = JSON.parse(data);
          const maxId = records.reduce((acc, cur) => Math.max(acc, cur.id), 0);
          record.id = maxId + 1;
          records.push(record);
          fs.writeFile(filePath, JSON.stringify(records), (err) => {
            if (err) {
              res.statusCode = 500;
              res.end(`Error writing file: ${err}`);
            } else {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(record));
            }
          });
        }
      });
    });
  } else if (method === "PUT") {
    const id = parseInt(url.substring(1));
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const record = JSON.parse(body);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(`Error reading file: ${err}`);
        } else {
          const records = JSON.parse(data);
          const index = records.findIndex((r) => r.id === id);
          if (index === -1) {
            res.statusCode = 404;
            res.end(`Record not found: ${id}`);
          } else {
            record.id = id;
            records[index] = record;
            fs.writeFile(filePath, JSON.stringify(records), (err) => {
              if (err) {
                res.statusCode = 500;
                res.end(`Error writing file: ${err}`);
              } else {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(record));
              }
            });
          }
        }
      });
    });
  } else if (method === "DELETE") {
    const id = parseInt(url.substring(1));
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading file: ${err}`);
      } else {
        const records = JSON.parse(data);
        const index = records.findIndex((r) => r.id === id);
        if (index === -1) {
          res.statusCode = 404;
          res.end(`Record not found: ${id}`);
        } else {
          records.splice(index, 1);
          fs.writeFile(filePath, JSON.stringify(records), (err) => {
            if (err) {
              res.statusCode = 500;
              res.end(`Error writing file: ${err}`);
            } else {
              res.end(`Record deleted: ${id}`);
            }
          });
        }
      }
    });
  } else {
    res.statusCode = 405;
    res.end();
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});