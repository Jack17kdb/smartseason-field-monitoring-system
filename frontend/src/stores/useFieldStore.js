import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

const useFieldStore = create((set) => ({
  fields: [],
  selectedField: null,
  observations: [],
  dashboardStats: null,
  agents: [],
  isLoading: false,

  getAssignedFields: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/fields');
      set({ fields: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load fields');
    } finally {
      set({ isLoading: false });
    }
  },

  getFieldDetails: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/fields/${id}`);
      set({ selectedField: res.data.field, observations: res.data.observations });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load field');
    } finally {
      set({ isLoading: false });
    }
  },

  updateFieldStage: async (id, stage) => {
    try {
      const res = await axiosInstance.patch(`/fields/${id}/stage`, { stage });
      set((state) => ({
        fields: state.fields.map((f) => (f._id === id ? res.data : f)),
        selectedField: state.selectedField?._id === id ? res.data : state.selectedField,
      }));
      toast.success('Stage updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stage');
    }
  },

  addObservation: async (id, note) => {
    try {
      const res = await axiosInstance.post(`/fields/${id}/observations`, { note });
      set((state) => ({ observations: [res.data, ...state.observations] }));
      toast.success('Observation added');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add observation');
      return false;
    }
  },

  getAllFields: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/admin/fields');
      set({ fields: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load fields');
    } finally {
      set({ isLoading: false });
    }
  },

  getDashboardStats: async () => {
    try {
      const res = await axiosInstance.get('/admin/dashboard');
      set({ dashboardStats: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load stats');
    }
  },

  getAgents: async () => {
    try {
      const res = await axiosInstance.get('/admin/agents');
      set({ agents: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load agents');
    }
  },

  createField: async (data) => {
    try {
      const res = await axiosInstance.post('/admin/field', data);
      set((state) => ({ fields: [res.data, ...state.fields] }));
      toast.success('Field created');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create field');
      return false;
    }
  },

  assignField: async (id, username) => {
    try {
      const res = await axiosInstance.patch(`/admin/field/${id}/assign`, { username });
      set((state) => ({
        fields: state.fields.map((f) => (f._id === id ? res.data : f)),
      }));
      toast.success('Field assigned');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign field');
      return false;
    }
  },
}));

export default useFieldStore;
