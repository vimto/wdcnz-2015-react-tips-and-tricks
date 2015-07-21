import sass from 'node-sass';
import path from 'path';

const sassFileName  = path.resolve(__dirname, '../../client/styles/main.scss');
const compiledCSS   = sass.renderSync({file: sassFileName});

const createImage = (phantom, document) => {
  return new Promise((resolve, reject) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${compiledCSS}</style>
        </head>
        <body style='margin: 0; background-color: transparent;'>
          ${document.html}
        </body>
      </html>
    `

    phantom.createPage((page) => {
      page.set('viewportSize', { width: document.width, height: document.width });
      page.setContent(html, 'http://localhost:8000', (status) => {
        page.renderBase64('PNG', (data) => {
          resolve(data)
        });
      })
    })

  });
};

export default createImage;
