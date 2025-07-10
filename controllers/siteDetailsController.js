const SiteDetail = require('../models/SiteDetails');

// Get full site detail
exports.getSiteDetail = async (req, res) => {
    try {
        const detail = await SiteDetail.findOne();

        res.status(200).json({
            success: true,
            message: 'Site detail fetched successfully',
            data: detail || {},
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            data: null,
        });
    }
};


// Helper to get or create initial record
const getOrCreateSiteDetail = async () => {
    let detail = await SiteDetail.findOne();
    if (!detail) detail = await SiteDetail.create({});
    return detail;
};

// Update About
exports.updateAbout = async (req, res) => {
    try {
        const { aboutTitle, aboutContent } = req.body;
        const detail = await getOrCreateSiteDetail();
        detail.aboutTitle = aboutTitle;
        detail.aboutContent = aboutContent;
        await detail.save();
        res.json({ message: 'About updated', aboutTitle, aboutContent });
    } catch (err) {
        res.status(500).json({ message: 'Error updating About' });
    }
};

// Update Terms
exports.updateTerms = async (req, res) => {
    try {
        const { termsContent } = req.body;
        const detail = await getOrCreateSiteDetail();
        detail.termsContent = termsContent;
        await detail.save();
        res.json({ message: 'Terms updated', termsContent });
    } catch (err) {
        res.status(500).json({ message: 'Error updating Terms' });
    }
};

// Update Privacy
exports.updatePrivacy = async (req, res) => {
    try {
        const { privacyContent } = req.body;
        const detail = await getOrCreateSiteDetail();
        detail.privacyContent = privacyContent;
        await detail.save();
        res.json({ message: 'Privacy Policy updated', privacyContent });
    } catch (err) {
        res.status(500).json({ message: 'Error updating Privacy' });
    }
};

// Update Footer About
exports.updateFooter = async (req, res) => {
    try {
        const { footerAbout } = req.body;
        const detail = await getOrCreateSiteDetail();
        detail.footerAbout = footerAbout;
        await detail.save();
        res.json({ message: 'Footer updated', footerAbout });
    } catch (err) {
        res.status(500).json({ message: 'Error updating Footer' });
    }
};

// Social Media
exports.addSocialMedia = async (req, res) => {
    try {
        const detail = await getOrCreateSiteDetail();
        detail.socialMedia.push(req.body);
        await detail.save();
        res.json({ message: 'Social media added', socialMedia: detail.socialMedia });
    } catch (err) {
        res.status(500).json({ message: 'Error adding Social Media' });
    }
};

exports.deleteSocialMedia = async (req, res) => {
    try {
        const detail = await getOrCreateSiteDetail();
        detail.socialMedia = detail.socialMedia.filter(sm => sm._id.toString() !== req.params.id);
        await detail.save();
        res.json({ message: 'Social media removed' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting Social Media' });
    }
};

