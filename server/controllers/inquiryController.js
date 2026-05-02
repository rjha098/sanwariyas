// PURPOSE: Handle HTTP requests for inquiry operations


import * as inquiryService from '../services/inquiryService.js';

const submitInquiry = async (req, res) => {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const data = await inquiryService.getAllInquiries(req.query);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const inquiry = await inquiryService.updateInquiryStatus(req.params.id, req.body);
    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export {
  getInquiries,
  submitInquiry,
  updateStatus,
};
