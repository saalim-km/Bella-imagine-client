import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, SaveIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAllCategoryQuery } from "@/hooks/admin/useAllCategory";
import { contestValidationSchema } from "@/utils/formikValidators/contest/contest.validator";
import { IContest } from "@/types/Contest";
import { useCreateContestMutation } from "@/hooks/contest/useContest";
import { toast } from "sonner";
import { handleError } from "@/utils/Error/errorHandler";

const ContestCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const {mutate : createContest} = useCreateContestMutation()
  const [isEditing, setIsEditing] = useState(false);


  const { data } = useAllCategoryQuery();
  const categories = data?.categories || [];


  const initialValues : IContest = {
    title: "",
    description: "",
    contestType: "weekly",
    categoryId: categories.length > 0 ? categories[0]._id : "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    featured: false,
  };

  // Load contest data if editing
  useEffect(() => {
    if (editId && categories.length > 0) {
      setIsEditing(true);
      // Simulate loading contest data (replace with API call in real app)
      if (editId === "weekly") {
        initialValues.title = "Weekly Challenge: Street Photography";
        initialValues.description =
          "Capture the essence of urban life and street scenes. Show us your best street photography.";
        initialValues.startDate = new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        );
        initialValues.endDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
        initialValues.categoryId = categories.find(
          (cat) => cat.title.toLowerCase() === "street"
        )?._id || categories[0]._id;
        initialValues.contestType = "weekly";
        initialValues.featured = true;
      } else if (editId === "monthly") {
        initialValues.title = "Photo of the Month: Nature";
        initialValues.description =
          "Show us your best nature shots - landscapes, wildlife, plants, and natural phenomena.";
        initialValues.startDate = new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000
        );
        initialValues.endDate = new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000
        );
        initialValues.categoryId = categories.find(
          (cat) => cat.title.toLowerCase() === "landscape"
        )?._id || categories[0]._id;
        initialValues.contestType = "monthly";
        initialValues.featured = false;
      }
    }
  }, [editId, categories]);

  const handleSubmit = async (
    values : IContest
  ) => {
    createContest(values,{
      onSuccess : (data)=> {
        toast.success(data.message)
        navigate(-1)
      },
      onError:  (err)=> {
        handleError(err)
      }
    })
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Contest" : "Create Contest"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Edit Contest Details" : "New Contest"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the details of your existing contest."
              : "Create a new contest for photographers to participate in."}
          </CardDescription>
        </CardHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={contestValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize // Allows reinitializing form when initialValues change (e.g., on edit)
        >
          {({ values, setFieldValue, isSubmitting, errors, touched }) => (
            <Form>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    placeholder="e.g., Monthly Portrait Challenge"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    placeholder="Describe the contest theme, rules, and criteria..."
                    rows={4}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Contest Type */}
                <div className="space-y-2">
                  <Label htmlFor="contestType">Contest Type</Label>
                  <Field name="contestType">
                    {({ field }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          setFieldValue("contestType", value)
                        }
                      >
                        <SelectTrigger id="contestType">
                          <SelectValue placeholder="Select contest type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">
                            Weekly Challenge
                          </SelectItem>
                          <SelectItem value="monthly">
                            Monthly Contest
                          </SelectItem>
                          <SelectItem value="yearly">
                            Yearly Competition
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="contestType"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Field name="categoryId">
                    {({ field }: any) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) =>
                          setFieldValue("categoryId", value)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Dates */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !values.startDate && "text-muted-foreground",
                            errors.startDate &&
                              touched.startDate &&
                              "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {values.startDate ? (
                            format(values.startDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={values.startDate}
                          onSelect={(date) => setFieldValue("startDate", date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !values.endDate && "text-muted-foreground",
                            errors.endDate && touched.endDate && "border-red-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {values.endDate ? (
                            format(values.endDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={values.endDate}
                          onSelect={(date) => setFieldValue("endDate", date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={values.featured}
                    onCheckedChange={(checked) =>
                      setFieldValue("featured", checked)
                    }
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Feature this contest on the homepage
                  </Label>
                  <ErrorMessage
                    name="featured"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">
                        {isEditing ? "Updating..." : "Creating..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      {isEditing ? "Update Contest" : "Create Contest"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default ContestCreate;