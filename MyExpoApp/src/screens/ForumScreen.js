import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';

const ForumScreen = () => {
  const forumPosts = [
    {
      id: 1,
      title: "Trail conditions update - Pine Ridge Loop",
      author: "TrailMaster_Mike",
      time: "2 hours ago",
      category: "Trail Reports",
      replies: 12,
      preview: "Just hiked Pine Ridge this morning. Some fallen trees blocking the path around mile marker 3..."
    },
    {
      id: 2,
      title: "Wildlife spotted: Black Bear with cubs",
      author: "NatureWatcher",
      time: "5 hours ago",
      category: "Wildlife",
      replies: 8,
      preview: "Saw a mama bear with two cubs near Cascade Falls. Keep your distance and make noise..."
    },
    {
      id: 3,
      title: "Best time to visit Sunset Peak?",
      author: "NewHiker2024",
      time: "1 day ago",
      category: "Questions",
      replies: 15,
      preview: "Planning my first visit to Sunset Peak. What's the best time of day for the views?"
    }
  ];

  const categories = ["All", "Trail Reports", "Wildlife", "Questions", "Safety", "Tips"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗣️ Trail Forum</Text>
        <TouchableOpacity style={styles.newPostButton}>
          <Text style={styles.newPostText}>+ New Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={[styles.categoryChip, index === 0 && styles.activeCategoryChip]}>
            <Text style={[styles.categoryText, index === 0 && styles.activeCategoryText]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.postsContainer}>
        {forumPosts.map((post) => (
          <TouchableOpacity key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{post.category}</Text>
              </View>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postPreview}>{post.preview}</Text>
            <View style={styles.postFooter}>
              <Text style={styles.postAuthor}>by {post.author}</Text>
              <Text style={styles.postReplies}>💬 {post.replies} replies</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZE.XL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  newPostButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
  },
  newPostText: {
    color: COLORS.WHITE,
    fontWeight: '600',
    fontSize: FONT_SIZE.SM,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  categoryChip: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    marginRight: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.GRAY,
  },
  activeCategoryChip: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  categoryText: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: COLORS.WHITE,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
  },
  postCard: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  categoryBadge: {
    backgroundColor: COLORS.ACCENT_LIGHT,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.SM,
  },
  categoryBadgeText: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  postTime: {
    fontSize: FONT_SIZE.XS,
    color: COLORS.TEXT_LIGHT,
  },
  postTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  postPreview: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.SM,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAuthor: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  postReplies: {
    fontSize: FONT_SIZE.SM,
    color: COLORS.TEXT_LIGHT,
  },
});

export default ForumScreen;
