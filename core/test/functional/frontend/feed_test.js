/**
 * Tests if RSS exists and is working
 */
/*globals url, CasperTest, casper */
CasperTest.begin('Ensure that RSS is available', 13, function suite(test) {
    CasperTest.Routines.togglePermalinks.run('off');
    casper.thenOpen(url + 'rss/', function (response) {
        var content = this.getPageContent(),
            siteTitle = '<title><![CDATA[Ghost]]></title>',
            siteDescription = '<description><![CDATA[Just a blogging platform.]]></description>',
            siteUrl = '<link>http://127.0.0.1:2369/</link>',
            hubUrl = '<atom:link href="https://pubsubhubbub.superfeedr.com/" rel="hub"/>',
            selfUrl = '<atom:link href="http://127.0.0.1:2369/rss/" rel="self" type="application/rss+xml"/>',
            postTitle = '<![CDATA[Welcome to Ghost]]>',
            postStart = '<description><![CDATA[<p>You’re live!',
            postEnd = 'you think :)</p>]]></description>',
            postLink = '<link>http://127.0.0.1:2369/welcome-to-ghost/</link>',
            postCreator = '<dc:creator><![CDATA[Test User]]>';

        test.assertEqual(response.status, 200, 'Response status should be 200.');
        test.assert(content.indexOf('<rss') >= 0, 'Feed should contain <rss');
        test.assert(content.indexOf(siteTitle) >= 0, 'Feed should contain blog title.');
        test.assert(content.indexOf(siteDescription) >= 0, 'Feed should contain blog description.');
        test.assert(content.indexOf(siteUrl) >= 0, 'Feed should contain link to blog.');
        test.assert(content.indexOf(hubUrl) >= 0, 'Feed should contain atom link to designated hub.');
        test.assert(content.indexOf(selfUrl) >= 0, 'Feed should contain atom link to self.');
        test.assert(content.indexOf(postTitle) >= 0, 'Feed should contain welcome post title.');
        test.assert(content.indexOf(postStart) >= 0, 'Feed should contain start of welcome post content.');
        test.assert(content.indexOf(postEnd) >= 0, 'Feed should contain end of welcome post content.');
        test.assert(content.indexOf(postLink) >= 0, 'Feed should have link to the welcome post.');
        test.assert(content.indexOf(postCreator) >= 0, 'Welcome post should have Test User as the creator.');
        test.assert(content.indexOf('</rss>') >= 0, 'Feed should contain </rss>');
    });
}, false);

CasperTest.begin('Ensure that author element is not included. Only dc:creator', 3, function suite(test) {
    CasperTest.Routines.togglePermalinks.run('off');
    casper.thenOpen(url + 'rss/', function (response) {
        var content = this.getPageContent(),
            author = '<author>',
            postCreator = '<dc:creator><![CDATA[Test User]]>';

        test.assertEqual(response.status, 200, 'Response status should be 200.');
        test.assert(content.indexOf(author) < 0, 'Author element should not be included');
        test.assert(content.indexOf(postCreator) >= 0, 'Welcome post should have Test User as the creator.');
    });
}, false);

CasperTest.begin('Ensures dated permalinks works with RSS', 2, function suite(test) {
    CasperTest.Routines.togglePermalinks.run('on');
    casper.thenOpen(url + 'rss/', function (response) {
        var content = this.getPageContent(),
            today = new Date(),
            dd = ("0" + today.getDate()).slice(-2),
            mm = ("0" + (today.getMonth() + 1)).slice(-2),
            yyyy = today.getFullYear(),
            postLink = '/' + yyyy + '/' + mm + '/' + dd + '/welcome-to-ghost/';

        test.assertEqual(response.status, 200, 'Response status should be 200.');
        test.assert(content.indexOf(postLink) >= 0, 'Feed should have dated permalink.');
    });
    CasperTest.Routines.togglePermalinks.run('off');
}, false);
